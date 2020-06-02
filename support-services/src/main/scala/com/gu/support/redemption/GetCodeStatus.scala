package com.gu.support.redemption

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object GetCodeStatus {

  sealed abstract class RedemptonInvalid(val clientCode: String)
  case object NoSuchCode extends RedemptonInvalid("NO_SUCH_CODE")
  case object CodeAlreadyUsed extends RedemptonInvalid("CODE_ALREADY_USED")

  private def statusFromDynamoAttr(attrs: Map[String, Boolean]): Either[String, RedemptionTable.AvailableField] = {
    for {
      available <- attrs.get(RedemptionTable.AvailableField.name).toRight(s"no boolean field 'available' in: $attrs")
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
