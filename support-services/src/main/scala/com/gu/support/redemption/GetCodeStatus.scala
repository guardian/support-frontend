package com.gu.support.redemption

import com.amazonaws.services.dynamodbv2.model.AttributeValue

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object GetCodeStatus {

  sealed abstract class RedemptonInvalid(val clientCode: String)
  case object NoSuchCode extends RedemptonInvalid("NO_SUCH_CODE")
  case object CodeAlreadyUsed extends RedemptonInvalid("CODE_ALREADY_USED")

  private def statusFromDynamoAttr(attrs: Map[String, AttributeValue]): Either[String, RedemptionTable.AvailableField] = {
    for {
      attributeValue <- attrs.get(RedemptionTable.AvailableField.name).toRight(s"no field 'available' in: $attrs")
      available <- Option(attributeValue.getBOOL).map(Boolean2boolean).toRight(s"field 'available' wasn't a boolean: $attrs")
    } yield RedemptionTable.AvailableField.decoded(available)
  }

  def withDynamoLookup(dynamoLookup: DynamoLookup): GetCodeStatus = new GetCodeStatus(dynamoLookup)

}

class GetCodeStatus(dynamoLookup: DynamoLookup) extends WithLogging {

  import GetCodeStatus._

  def apply(code: RedemptionCode)(implicit ec: ExecutionContext): Future[Either[RedemptonInvalid, Unit]] =
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
