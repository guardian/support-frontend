package controllers

import akka.util.ByteString
import com.typesafe.scalalogging.LazyLogging
import play.api.libs.streams.Accumulator
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Random

object ActionOps {

  val formatter =
    pprint.copy(
      additionalHandlers = { case value: ByteString =>
        pprint.Tree.Literal(s"""ByteString("${value.utf8String}")""")
      },
    )

  case class LogId(value: String) extends AnyVal
  object LogId {
    def unsafe: LogId = LogId(Random.nextLong().toHexString)
  }

  implicit class Extension[A](action: Action[A]) extends LazyLogging {

    def withLogging(class1: String, message: String, logId: LogId = LogId.unsafe): Action[A] = new Action[A] {
      override def parser: BodyParser[A] = new BodyParser[A] {
        override def apply(requestHeader: RequestHeader): Accumulator[ByteString, Either[Result, A]] = {
          val parsed = action.parser.apply(requestHeader)
          parsed.map {
            case Left(result) =>
              logger.warn(s"${logId.value}: action $class1.$message failed with: $result")
              Left(result)
            case Right(a) =>
              logger.info(s"${logId.value}: action $class1.$message started with:\n${prettyPrint(a)}")
              Right(a)
          }(executionContext)
        }
      }

      override def apply(request: Request[A]): Future[Result] = {
        val result = action.apply(request)
        result.onComplete { result =>
          logger.info(s"${logId.value}: action $class1.$message completed with:\n${prettyPrint(result)}")
        }(executionContext)
        result
      }

      override def executionContext: ExecutionContext = action.executionContext

    }
  }

  private def prettyPrint[A](a: A) = {
    val lines = formatter.tokenize(a)
    val indented = lines.map(str => str.plainText).mkString.replaceAll("  ", ". ")
    " |" + indented.replaceAll("""\n""", "\n |")
  }
}
