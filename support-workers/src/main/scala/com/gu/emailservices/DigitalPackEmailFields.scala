package com.gu.emailservices

import cats.implicits._
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes.{CCAttributes, DDAttributes, PPAttributes}
import com.gu.emailservices.SubscriptionEmailFieldHelpers._
import com.gu.support.workers._
import com.gu.support.workers.states.PaymentMethodWithSchedule
import com.gu.support.zuora.api.ReaderType
import io.circe._
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._

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

    implicit val encoder: Encoder.AsObject[PaymentFieldsAttributes] = Encoder.AsObject.instance {
      case v: DDAttributes => v.asJsonObject
      case v: CCAttributes => v.asJsonObject
      case v: PPAttributes => v.asJsonObject
    }

    case class DDAttributes(
      account_number: String,
      sort_code: String,
      account_name: String,
      mandateid: String,
      default_payment_method: String = "Direct Debit",
    ) extends PaymentFieldsAttributes

    case class CCAttributes(
      default_payment_method: String = "Credit/Debit Card",
    ) extends PaymentFieldsAttributes

    case class PPAttributes(
      default_payment_method: String = "PayPal",
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
  ) extends DigitalSubscriptionEmailAttributes

  case class GifteeNotificationAttributes(
    gifter_first_name: String,
    gift_personal_message: Option[String],
    gift_code: String,
  ) extends DigitalSubscriptionEmailAttributes

}
class DigitalPackEmailFields(
  subscriptionEmailFields: SubscriptionEmailFields,
) {

  import DigitalPackEmailFields._
  import DigitalSubscriptionEmailAttributes._
  import subscriptionEmailFields._
  import allProductsEmailFields._

  private def directOrCorpFields(details: String) = BasicDSAttributes(
    zuorasubscriberid = subscriptionNumber,
    emailaddress = user.primaryEmailAddress,
    first_name = user.firstName,
    last_name = user.lastName,
    subscription_details = details
  )

  def build(
    paidSubPaymentData: Option[PaymentMethodWithSchedule],
    readerType: ReaderType,
    maybeGiftRecipient: Option[GiftRecipient.DigiSub]
  ): Either[String, List[EmailFields]] = {

    val Purchase = Some
    val Redemption = None

    (paidSubPaymentData, readerType) match {
      case (Purchase(paymentInfo), ReaderType.Gift) =>
        for {
          giftRecipient <- maybeGiftRecipient.toRight("Gift redemption must have a gift recipient")
          emailFieldses <- List(
            giftPurchaserConfirmation(paymentInfo.paymentMethod),
            giftRecipientNotification(giftRecipient)
          ).sequence
        } yield emailFieldses
      case (Purchase(paymentInfo), _) => directThankYou(paymentInfo).map(List(_))
      case (Redemption, ReaderType.Corporate) => corpRedemption.map(List(_))
      case (Redemption, ReaderType.Gift) => giftRedemption.map(List(_))
      case (Redemption, _) => Left("redemption is only possible for gift and corporate subs")
    }
  }

  private def wrap(dataExtensionName: String, fields: DigitalSubscriptionEmailAttributes) = for {
    attributePairs <- JsonToAttributes.asFlattenedPairs(fields.asJsonObject)
  } yield EmailFields(attributePairs, Left(sfContactId), user.primaryEmailAddress, dataExtensionName)

  private def giftRecipientNotification(giftRecipient: GiftRecipient.DigiSub) =
    wrap("digipack-gift-notification", GifteeNotificationAttributes(
      gifter_first_name = user.firstName,
      gift_personal_message = giftRecipient.giftMessage,
      gift_code = "gift_code"
    ))

  private def giftPurchaserConfirmation(pm: PaymentMethod) =
    wrap("digipack-gift-purchase", GifterPurchaseAttributes(
      gifter_first_name = user.firstName,
      gifter_last_name = user.lastName,
      gift_recipient_first_name = "gift recipient first name placeholder",
      gift_recipient_last_name = "gift recipient last name placeholder",
      gift_recipient_email = "gift recipient email placeholder",
      gift_personal_message = "gift personal message placeholder",
      gift_code = "gift code placeholder",
      gift_delivery_date = "gift delivery date placeholder",
      subscription_details = "subscription details placeholder",
      date_of_first_payment = "date_of_first_payment",
      paymentAttributes = paymentFields(pm, directDebitMandateId)
    ))

  private def giftRedemption =
    wrap("digipack-gift-redemption", GifteeRedemptionAttributes(
      gift_recipient_first_name = user.firstName,
      subscription_details = "subscription_details placeholder",
      gift_start_date = "gift start date placeholder",
      gift_recipient_email = user.primaryEmailAddress
    ))

  private def corpRedemption =
    wrap("digipack-corporate-redemption", directOrCorpFields("Group subscription"))

  private def directThankYou(paymentMethodWithSchedule: PaymentMethodWithSchedule) =
    wrap("digipack", DirectDSAttributes(
      directOrCorpFields(SubscriptionEmailFieldHelpers.describe(paymentMethodWithSchedule.paymentSchedule, billingPeriod, currency, promotion)),
      country = user.billingAddress.country.name,
      date_of_first_payment = formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentMethodWithSchedule.paymentSchedule).date),
      trial_period = "14", //TODO: depends on Promo code or zuora config
      paymentFields(paymentMethodWithSchedule.paymentMethod, directDebitMandateId)
    ))

}

object DigitalPackEmailFields {

  def paymentFields(paymentMethod: PaymentMethod, directDebitMandateId: Option[String]): PaymentFieldsAttributes =
    paymentMethod match {
      case dd: DirectDebitPaymentMethod => DDAttributes(
        account_number = mask(dd.bankTransferAccountNumber),
        sort_code = hyphenate(dd.bankCode),
        account_name = dd.bankTransferAccountName,
        mandateid = directDebitMandateId.getOrElse("")
      )
      case dd: ClonedDirectDebitPaymentMethod => DDAttributes(
        sort_code = hyphenate(dd.bankCode),
        account_number = mask(dd.bankTransferAccountNumber),
        account_name = dd.bankTransferAccountName,
        mandateid = dd.mandateId
      )
      case _: CreditCardReferenceTransaction => CCAttributes()
      case _: PayPalReferenceTransaction => PPAttributes()
    }

}

object JsonToAttributes {

  type Failable[A] = Either[String, A]

  // this turns a JsonObject into a List of key/value pairs for insertion into the existing EmailFields object.
  // (We don't want to change the non DS emails at this point, so it makes sense to convert the case classes to the existing structure.)
  def asFlattenedPairs(value: JsonObject): Failable[List[(String, String)]] = {
    def flattenToPairs(value: JsonObject, failablePairsSoFar: Failable[Map[String, String]]): Failable[Map[String, String]] =
      value.toList.foldLeft(failablePairsSoFar) {
        case (failablePairsSoFar, (fieldName, jValue)) =>
          failablePairsSoFar.flatMap { pairsSoFar =>
            jValue.asString match {
              case None =>
                jValue.asObject match {
                  case None => Left(s"all values should be string or object: ${fieldName} -> $value")
                  case Some(obj) =>
                    flattenToPairs(obj, Right(pairsSoFar))
                }
              case Some(string) =>
                if (pairsSoFar.contains(fieldName))
                  Left(s"found duplicate key ${fieldName} in case classes")
                else
                  Right(pairsSoFar + (fieldName -> string))
            }
          }
      }

    flattenToPairs(value, Right(Map.empty)).map(_.toList)
  }

}
