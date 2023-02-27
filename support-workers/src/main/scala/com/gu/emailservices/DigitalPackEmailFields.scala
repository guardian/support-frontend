package com.gu.emailservices

import cats.implicits._
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes.{
  APAttributes,
  CCAttributes,
  DDAttributes,
  PPAttributes,
  SepaAttributes,
}
import com.gu.emailservices.SubscriptionEmailFieldHelpers._
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState._
import io.circe._
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._
import org.joda.time.LocalDate
import org.joda.time.format.ISODateTimeFormat

import scala.concurrent.{ExecutionContext, Future}

sealed trait DigitalSubscriptionEmailAttributes extends Product with Serializable
object DigitalSubscriptionEmailAttributes {

  implicit val e1: Encoder.AsObject[BasicDSAttributes] = deriveEncoder
  implicit val e2: Encoder.AsObject[DirectDSAttributes] = deriveEncoder
  implicit val e3: Encoder.AsObject[GifteeRedemptionAttributes] = deriveEncoder
  implicit val e4: Encoder.AsObject[GifterPurchaseAttributes] = deriveEncoder
  implicit val e5: Encoder.AsObject[GifteeNotificationAttributes] = deriveEncoder

  implicit val encoder: Encoder.AsObject[DigitalSubscriptionEmailAttributes] = Encoder.AsObject.instance {
    case v: BasicDSAttributes => v.asJsonObject
    case v: DirectDSAttributes => v.asJsonObject
    case v: GifteeRedemptionAttributes => v.asJsonObject
    case v: GifterPurchaseAttributes => v.asJsonObject
    case v: GifteeNotificationAttributes => v.asJsonObject
  }

  sealed trait PaymentFieldsAttributes extends Product with Serializable {
    val default_payment_method: String
  }
  object PaymentFieldsAttributes {

    implicit val e1: Encoder.AsObject[DDAttributes] = deriveEncoder
    implicit val e2: Encoder.AsObject[CCAttributes] = deriveEncoder
    implicit val e3: Encoder.AsObject[PPAttributes] = deriveEncoder
    implicit val e4: Encoder.AsObject[APAttributes] = deriveEncoder
    implicit val e5: Encoder.AsObject[SepaAttributes] = deriveEncoder

    implicit val encoder: Encoder.AsObject[PaymentFieldsAttributes] = Encoder.AsObject.instance {
      case v: DDAttributes => v.asJsonObject
      case v: CCAttributes => v.asJsonObject
      case v: PPAttributes => v.asJsonObject
      case v: APAttributes => v.asJsonObject
      case v: SepaAttributes => v.asJsonObject
    }

    case class DDAttributes(
        account_number: String,
        sort_code: String,
        account_name: String,
        mandateid: String,
        default_payment_method: String = "Direct Debit",
    ) extends PaymentFieldsAttributes

    case class SepaAttributes(
        iban: String,
        default_payment_method: String = "Sepa",
    ) extends PaymentFieldsAttributes

    case class CCAttributes(
        default_payment_method: String = "Credit/Debit Card",
    ) extends PaymentFieldsAttributes

    case class PPAttributes(
        default_payment_method: String = "PayPal",
    ) extends PaymentFieldsAttributes

    case class APAttributes(
        default_payment_method: String = "AmazonPay",
    ) extends PaymentFieldsAttributes

  }

  case class BasicDSAttributes(
      zuorasubscriberid: String,
      emailaddress: String,
      first_name: String,
      last_name: String,
      subscription_details: String,
  ) extends DigitalSubscriptionEmailAttributes

  case class DirectDSAttributes(
      directCorp: BasicDSAttributes,
      country: String,
      date_of_first_payment: String,
      trial_period: String,
      paymentFieldsAttributes: PaymentFieldsAttributes,
  ) extends DigitalSubscriptionEmailAttributes

  case class GifteeRedemptionAttributes(
      gift_recipient_first_name: String,
      subscription_details: String,
      gift_start_date: String,
      gift_recipient_email: String,
      gift_end_date: String,
  ) extends DigitalSubscriptionEmailAttributes

  case class GifterPurchaseAttributes(
      gifter_first_name: String,
      gifter_last_name: String,
      gift_recipient_first_name: String,
      gift_recipient_last_name: String,
      gift_recipient_email: String,
      gift_personal_message: String,
      gift_code: String,
      gift_delivery_date: String,
      subscription_details: String,
      paymentAttributes: PaymentFieldsAttributes,
      date_of_first_payment: String,
      last_redemption_date: String,
  ) extends DigitalSubscriptionEmailAttributes

  case class GifteeNotificationAttributes(
      gifter_first_name: String,
      gifter_last_name: String,
      gift_personal_message: Option[String],
      gift_code: String,
      last_redemption_date: String,
      duration: String,
  ) extends DigitalSubscriptionEmailAttributes

}
class DigitalPackEmailFields(
    paperFieldsGenerator: PaperFieldsGenerator,
    getMandate: String => Future[Option[String]],
    touchPointEnvironment: TouchPointEnvironment,
) {

  import DigitalSubscriptionEmailAttributes._

  val digitalPackPaymentEmailFields = new DigitalPackPaymentEmailFields(getMandate)

  private def directOrCorpFields(details: String, subscriptionNumber: String, user: User) = BasicDSAttributes(
    zuorasubscriberid = subscriptionNumber,
    emailaddress = user.primaryEmailAddress,
    first_name = user.firstName,
    last_name = user.lastName,
    subscription_details = details,
  )

  def build(digi: SendThankYouEmailDigitalSubscriptionState)(implicit ec: ExecutionContext): Future[List[EmailFields]] =
    digi match {
      case state: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState =>
        Future.successful(List(corpRedemption(state)))
      case state: SendThankYouEmailDigitalSubscriptionGiftRedemptionState =>
        Future.successful(List(giftRedemption(state)))
    }

  private def wrap(
      dataExtensionName: String,
      fields: DigitalSubscriptionEmailAttributes,
      user: User,
      userAttributes: Option[JsonObject] = None,
  ): EmailFields = {
    val attributePairs =
      JsonToAttributes
        .asFlattenedPairs(fields.asJsonObject)
        .left
        .map(error => throw new RuntimeException(s"coding error: $error"))
        .merge
    EmailFields(attributePairs, user, dataExtensionName, userAttributes)
  }

  case class GifteeRedemptionUserAttributes(
      unmanaged_digital_subscription_gift_duration_months: Int,
      unmanaged_digital_subscription_gift_start_date: String,
      unmanaged_digital_subscription_gift_end_date: String,
  )

  object GifteeRedemptionUserAttributes {
    implicit val encoder = deriveEncoder[GifteeRedemptionUserAttributes]
  }

  private def giftRedemption(state: SendThankYouEmailDigitalSubscriptionGiftRedemptionState) =
    wrap(
      "digipack-gift-redemption",
      GifteeRedemptionAttributes(
        gift_recipient_first_name = state.user.firstName,
        subscription_details = s"${state.termDates.months} month digital subscription",
        gift_start_date = formatDate(state.termDates.giftStartDate),
        gift_recipient_email = state.user.primaryEmailAddress,
        gift_end_date = formatDate(state.termDates.giftEndDate),
      ),
      state.user,
      Some(
        GifteeRedemptionUserAttributes(
          unmanaged_digital_subscription_gift_duration_months = state.termDates.months,
          unmanaged_digital_subscription_gift_start_date =
            ISODateTimeFormat.date().print(state.termDates.giftStartDate),
          unmanaged_digital_subscription_gift_end_date = ISODateTimeFormat.date().print(state.termDates.giftEndDate),
        ).asJsonObject,
      ),
    )

  private def corpRedemption(state: SendThankYouEmailDigitalSubscriptionCorporateRedemptionState) =
    wrap(
      "digipack-corporate-redemption",
      directOrCorpFields("Group subscription", state.subscriptionNumber, state.user),
      state.user,
    )
}

class DigitalPackPaymentEmailFields(getMandate: String => Future[Option[String]]) {

  def paymentFields(paymentMethod: PaymentMethod, accountNumber: String)(implicit
      ec: ExecutionContext,
  ): Future[PaymentFieldsAttributes] =
    paymentMethod match {
      case dd: DirectDebitPaymentMethod =>
        getMandate(accountNumber).map(directDebitMandateId =>
          DDAttributes(
            account_number = mask(dd.BankTransferAccountNumber),
            sort_code = hyphenate(dd.BankCode),
            account_name = dd.BankTransferAccountName,
            mandateid = directDebitMandateId.getOrElse(""),
          ),
        )
      case dd: ClonedDirectDebitPaymentMethod =>
        Future.successful(
          DDAttributes(
            sort_code = hyphenate(dd.BankCode),
            account_number = mask(dd.BankTransferAccountNumber),
            account_name = dd.BankTransferAccountName,
            mandateid = dd.MandateId,
          ),
        )
      case _: CreditCardReferenceTransaction => Future.successful(CCAttributes())
      case _: PayPalReferenceTransaction => Future.successful(PPAttributes())
      case _: AmazonPayPaymentMethod => Future.successful(APAttributes())
      case sepa: SepaPaymentMethod => Future.successful(SepaAttributes(sepa.BankTransferAccountNumber))
    }

}

object JsonToAttributes {

  type Failable[A] = Either[String, A]

  // this turns a JsonObject into a List of key/value pairs for insertion into the existing EmailFields object.
  // (We don't want to change the non DS emails at this point, so it makes sense to convert the case classes to the existing structure.)
  def asFlattenedPairs(value: JsonObject): Failable[List[(String, String)]] = {
    def flattenToPairs(
        value: JsonObject,
        failablePairsSoFar: Failable[Map[String, String]],
    ): Failable[Map[String, String]] =
      value.toList.foldLeft(failablePairsSoFar) { case (failablePairsSoFar, (fieldName, jValue)) =>
        failablePairsSoFar.flatMap { pairsSoFar =>
          (jValue.isNull, jValue.asString, jValue.asObject) match {
            case (true, _, _) => Right(pairsSoFar)
            case (_, _, Some(obj)) => flattenToPairs(obj, Right(pairsSoFar))
            case (_, Some(string), _) =>
              if (pairsSoFar.contains(fieldName))
                Left(s"found duplicate key ${fieldName} in case classes")
              else
                Right(pairsSoFar + (fieldName -> string))
            case _ => Left(s"all values should be null, string or object: ${fieldName} -> $value")
          }
        }
      }

    flattenToPairs(value, Right(Map.empty)).map(_.toList)
  }

}
