package com.gu.support.redemption

import com.gu.support.redemption.DynamoLookup.{DynamoBoolean, DynamoString}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object GetCodeStatus {

  case class CorporateId(corporateIdString: String) extends AnyVal

  sealed abstract class RedemptionInvalid(val clientCode: String)
  case object NoSuchCode extends RedemptionInvalid("NO_SUCH_CODE")
  case object CodeAlreadyUsed extends RedemptionInvalid("CODE_ALREADY_USED")

  private def statusFromDynamoAttr(attrs: Map[String, DynamoLookup.DynamoValue]): Either[String, RedemptionTable.AvailableField] =
    for {
      attributeValue <- attrs.get(RedemptionTable.AvailableField.name).toRight(s"no field '${RedemptionTable.AvailableField.name}' in: $attrs")
      available <- attributeValue match {
        case DynamoBoolean(bool) => Right(bool)
        case _ => Left(s"field '${RedemptionTable.AvailableField.name}' wasn't a boolean: $attributeValue")
      }
    } yield RedemptionTable.AvailableField.decoded(available)

  private def corporateFromDynamoAttr(attrs: Map[String, DynamoLookup.DynamoValue]): Either[String, CorporateId] =
    for {
      attributeValue <- attrs.get(RedemptionTable.CorporateIdField.name).toRight(s"no field '${RedemptionTable.CorporateIdField.name}' in: $attrs")
      corporateId <- attributeValue match {
        case DynamoString(corporateIdString) => Right(CorporateId(corporateIdString))
        case _ => Left(s"field '${RedemptionTable.CorporateIdField.name}' wasn't a string: $attributeValue")
      }
    } yield corporateId

  def withDynamoLookup(dynamoLookup: DynamoLookup): GetCodeStatus = new GetCodeStatus(dynamoLookup)

}

class GetCodeStatus(dynamoLookup: DynamoLookup) extends WithLogging {

  import GetCodeStatus._

  def apply(code: RedemptionCode)(implicit ec: ExecutionContext): Future[Either[RedemptionInvalid, CorporateId]] =
    (for {
      maybeAttributes <- dynamoLookup.lookup(code.value)
      status <- FlattenErrors(maybeAttributes.map { attributes =>
        for {
          available <- statusFromDynamoAttr(attributes)
          corporateId <- corporateFromDynamoAttr(attributes)
        } yield (available, corporateId)
      })
    } yield status match {
      case None => Left(NoSuchCode)
      case Some((RedemptionTable.AvailableField.CodeIsAvailable, corporateId)) => Right(corporateId)
      case Some((RedemptionTable.AvailableField.CodeIsUsed, _)) => Left(CodeAlreadyUsed)
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
