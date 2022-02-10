package com.gu.support.redemption.corporate

import com.gu.support.redemption.{CodeAlreadyUsed, CodeNotFound, CodeStatus, ValidCorporateCode}
import com.gu.support.redemption.corporate.DynamoLookup.{DynamoBoolean, DynamoString}
import com.gu.support.redemptions.RedemptionCode

import scala.concurrent.{ExecutionContext, Future}
import scala.util.{Failure, Success}

object CorporateCodeValidator {

  case class CorporateId(corporateIdString: String) extends AnyVal

  private def statusFromDynamoAttr(
      attrs: Map[String, DynamoLookup.DynamoValue],
  ): Either[String, RedemptionTable.AvailableField] =
    for {
      attributeValue <- attrs
        .get(RedemptionTable.AvailableField.name)
        .toRight(s"no field '${RedemptionTable.AvailableField.name}' in: $attrs")
      available <- attributeValue match {
        case DynamoBoolean(bool) => Right(bool)
        case _ => Left(s"field '${RedemptionTable.AvailableField.name}' wasn't a boolean: $attributeValue")
      }
    } yield RedemptionTable.AvailableField.decoded(available)

  private def corporateFromDynamoAttr(attrs: Map[String, DynamoLookup.DynamoValue]): Either[String, CorporateId] =
    for {
      attributeValue <- attrs
        .get(RedemptionTable.CorporateIdField.name)
        .toRight(s"no field '${RedemptionTable.CorporateIdField.name}' in: $attrs")
      corporateId <- attributeValue match {
        case DynamoString(corporateIdString) => Right(CorporateId(corporateIdString))
        case _ => Left(s"field '${RedemptionTable.CorporateIdField.name}' wasn't a string: $attributeValue")
      }
    } yield corporateId

  def withDynamoLookup(dynamoLookup: DynamoLookup): CorporateCodeValidator = new CorporateCodeValidator(dynamoLookup)

}

class CorporateCodeValidator(dynamoLookup: DynamoLookup) extends WithLogging {

  import CorporateCodeValidator._

  def getStatus(code: RedemptionCode)(implicit ec: ExecutionContext): Future[CodeStatus] =
    (for {
      maybeAttributes <- dynamoLookup.lookup(code.value)
      status <- FlattenErrors(maybeAttributes.map { attributes =>
        for {
          available <- statusFromDynamoAttr(attributes)
          corporateId <- corporateFromDynamoAttr(attributes)
        } yield (available, corporateId)
      })
    } yield status match {
      case None => CodeNotFound
      case Some((RedemptionTable.AvailableField.CodeIsAvailable, corporateId)) => ValidCorporateCode(corporateId)
      case Some((RedemptionTable.AvailableField.CodeIsUsed, _)) => CodeAlreadyUsed
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
