package com.gu.support.redemption

import com.gu.support.redemption.DynamoLookup.DynamoBoolean

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object GetCodeStatus {

  sealed abstract class RedemptionInvalid(val clientCode: String)
  case object NoSuchCode extends RedemptionInvalid("NO_SUCH_CODE")
  case object CodeAlreadyUsed extends RedemptionInvalid("CODE_ALREADY_USED")

  private def statusFromDynamoAttr(attrs: Map[String, DynamoLookup.DynamoValue]): Either[String, RedemptionTable.AvailableField] = {
    for {
      attributeValue <- attrs.get(RedemptionTable.AvailableField.name).toRight(s"no field 'available' in: $attrs")
      available <- attributeValue match {
        case DynamoBoolean(bool) => Right(bool)
        case _ => Left(s"field 'available' wasn't a boolean: $attributeValue")
      }
    } yield RedemptionTable.AvailableField.decoded(available)
  }

  def withDynamoLookup(dynamoLookup: DynamoLookup): GetCodeStatus = new GetCodeStatus(dynamoLookup)

}

class GetCodeStatus(dynamoLookup: DynamoLookup) extends WithLogging {

  import GetCodeStatus._

  def apply(code: RedemptionCode)(implicit ec: ExecutionContext): Future[Either[RedemptionInvalid, Unit]] =
    (for {
      maybeAttributes <- dynamoLookup.lookup(code.value)
      maybeCodeAvailable <- FlattenErrors(maybeAttributes.map(statusFromDynamoAttr))
    } yield maybeCodeAvailable match {
      case None => Left(NoSuchCode)
      case Some(RedemptionTable.AvailableField.CodeIsAvailable) => Right(())
      case Some(RedemptionTable.AvailableField.CodeIsUsed) => Left(CodeAlreadyUsed)
    }).withLoggingAsync(s"look up $code")

}

object FlattenErrors {

  def apply[A](optionEither: Option[Either[String, A]]): Future[Option[A]] =
    Future.fromTry(optionEither match {
      case Some(Left(s)) => Failure(new RuntimeException(s))
      case None => Success(None)
      case Some(Right(a)) => Success(Some(a))
    })

}
