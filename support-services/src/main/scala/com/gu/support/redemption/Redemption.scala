package com.gu.support.redemption

import com.amazonaws.services.dynamodbv2.model.AttributeValue
import com.gu.support.config.{Stage, TouchPointEnvironment}
import com.gu.support.promotions.dynamo.{DynamoLookup, DynamoTableAsync, DynamoUpdate}
import com.gu.support.redemption.Redemption.validateCode.{CodeStatus, RedemptionDB}
import com.gu.support.redemption.Redemption.validateCode.CodeStatus.{CodeIsAvailable, CodeIsUsed}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object Redemption {

  case class RedemptionCode(value: String) extends AnyVal

  object validateCode {

    object RedemptionDB {
      val primaryKey = "redemptionCode"
    }

    sealed abstract class RedemptonInvalid(val clientCode: String)
    case object NoSuchCode extends RedemptonInvalid("NO_SUCH_CODE")
    case object CodeAlreadyUsed extends RedemptonInvalid("CODE_ALREADY_USED")

    object CodeStatus {
      val name = "available"
      def decoded(available: Boolean): CodeStatus = if (available) CodeIsAvailable else CodeIsUsed

      case object CodeIsAvailable extends CodeStatus(true)
      case object CodeIsUsed extends CodeStatus(false)

    }
    sealed abstract class CodeStatus(val encoded: Boolean)

    def parse(attrs: Map[String, AttributeValue]): Either[String, CodeStatus] = {
      for {
        attributeValue <- attrs.get(CodeStatus.name).toRight(s"no field 'available' in: $attrs")
        available <- Option[Boolean](attributeValue.getBOOL).toRight(s"field 'available' wasn't a boolean: $attrs")
      } yield CodeStatus.decoded(available)
    }

    import Implicits._

    def apply(code: RedemptionCode)(dynamoLookup: DynamoLookup)(implicit e: ExecutionContext): Future[Either[RedemptonInvalid, Unit]] =
      for {
        maybeJson <- dynamoLookup.lookup(code.value)
        maybeCodeAvailable <- maybeJson.map(parse).sequenceToFuture
      } yield maybeCodeAvailable match {
        case None => Left(NoSuchCode)
        case Some(CodeIsAvailable) => Right(())
        case Some(CodeIsUsed) => Left(CodeAlreadyUsed)
      }

  }

  def markCodeRedeemed(code: RedemptionCode, codeStatus: CodeStatus)(dynamoUpdate: DynamoUpdate): Future[Unit] =
    dynamoUpdate.update(code.value, CodeStatus.name, codeStatus.encoded)

}

object RedemptionServiceProvider {
  def apply(env: TouchPointEnvironment)(implicit e: ExecutionContext): DynamoTableAsync =
    DynamoTableAsync(s"redemption-codes-${env.envValue}-PROD", RedemptionDB.primaryKey)
}

object Implicits {

  implicit class seqOps[A](optionEither: Option[Either[String, A]]) {
    def sequenceToFuture: Future[Option[A]] =
      Future.fromTry(optionEither match {
        case Some(Left(s)) => Failure(new RuntimeException(s))
        case None => Success(None)
        case Some(Right(a)) => Success(Some(a))
      })
  }

}
