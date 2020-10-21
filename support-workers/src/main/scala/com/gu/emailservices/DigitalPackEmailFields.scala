package com.gu.emailservices

import cats.implicits._
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes
import com.gu.emailservices.DigitalSubscriptionEmailAttributes.PaymentFieldsAttributes.{CCAttributes, DDAttributes, PPAttributes}
import com.gu.emailservices.SubscriptionEmailFieldHelpers._
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers._
import com.gu.support.workers.states.ProductTypeCreated.DigitalSubscriptionCreated._
import com.gu.support.workers.states.ProductTypeCreated._
import io.circe._
import io.circe.generic.semiauto.deriveEncoder
import io.circe.syntax._

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
    gift_personal_message: Option[String],
    gift_code: String,
    last_redemption_date: String,
  ) extends DigitalSubscriptionEmailAttributes

}
class DigitalPackEmailFields(
  paperFieldsGenerator: PaperFieldsGenerator,
  getMandate: String => Future[Option[String]],
  touchPointEnvironment: TouchPointEnvironment,
  user: User,
  sfContactId: SfContactId,
) {

  import DigitalSubscriptionEmailAttributes._

  val digitalPackPaymentEmailFields = new DigitalPackPaymentEmailFields(getMandate)

  private def directOrCorpFields(details: String, subscriptionNumber: String) = BasicDSAttributes(
    zuorasubscriberid = subscriptionNumber,
    emailaddress = user.primaryEmailAddress,
    first_name = user.firstName,
    last_name = user.lastName,
    subscription_details = details
  )

  def build(digi: DigitalSubscriptionCreated)(implicit ec: ExecutionContext): Future[List[EmailFields]] =
    digi match {
      case giftPurchase: DigitalSubscriptionGiftPurchaseCreated =>
        for {
          emails <- List(
            giftPurchaserConfirmation(giftPurchase),
            Future.successful(giftRecipientNotification(giftPurchase))
          ).sequence
        } yield emails
      case directPurchase: DigitalSubscriptionDirectPurchaseCreated => directThankYou(directPurchase).map(List(_))
      case DigitalSubscriptionCorporateRedemptionCreated(_, subscriptionNumber) => Future.successful(List(corpRedemption(subscriptionNumber)))
      case DigitalSubscriptionGiftRedemptionCreated(product) => Future.successful(List(giftRedemption(product.billingPeriod)))
    }

  private def wrap(dataExtensionName: String, fields: DigitalSubscriptionEmailAttributes): EmailFields = {
    val attributePairs = JsonToAttributes.asFlattenedPairs(fields.asJsonObject).left.map(
      error => throw new RuntimeException(s"coding error: $error")
    ).merge
    EmailFields(attributePairs, Left(sfContactId), user.primaryEmailAddress, dataExtensionName)
  }

  private def giftRecipientNotification(giftPurchase: DigitalSubscriptionGiftPurchaseCreated) =
    wrap("digipack-gift-notification", GifteeNotificationAttributes(
      gifter_first_name = user.firstName,
      gift_personal_message = giftPurchase.giftRecipient.message,
      gift_code = giftPurchase.giftCode.value,
      last_redemption_date = formatDate(giftPurchase.lastRedemptionDate),
    ))

  private def giftPurchaserConfirmation(giftPurchase: DigitalSubscriptionGiftPurchaseCreated)(implicit ec: ExecutionContext) = {
    import giftPurchase._
    import purchaseInfo._

    val promotion = paperFieldsGenerator.getAppliedPromotion(
      promoCode,
      user.billingAddress.country,
      ProductTypeRatePlans.digitalRatePlan(product, touchPointEnvironment).map(_.id).getOrElse("")
    )
    digitalPackPaymentEmailFields.paymentFields(paymentMethod, accountNumber).map(eventualFieldsAttributes =>
    wrap("digipack-gift-purchase", GifterPurchaseAttributes(
      gifter_first_name = user.firstName,
      gifter_last_name = user.lastName,
      gift_recipient_first_name = giftRecipient.firstName,
      gift_recipient_last_name = giftRecipient.lastName,
      gift_recipient_email = giftRecipient.email,
      gift_personal_message = giftRecipient.message.getOrElse(""),
      gift_code = giftCode.value,
      gift_delivery_date = formatDate(giftRecipient.deliveryDate),
      subscription_details = SubscriptionEmailFieldHelpers.describe(paymentSchedule, product, promotion),
      date_of_first_payment = formatDate(SubscriptionEmailFieldHelpers.firstPayment(paymentSchedule).date),
      paymentAttributes = eventualFieldsAttributes,
      last_redemption_date = formatDate(lastRedemptionDate),
    )))
  }

  private def giftRedemption(billingPeriod: BillingPeriod) =
    wrap("digipack-gift-redemption", GifteeRedemptionAttributes(
      gift_recipient_first_name = user.firstName,
      subscription_details = billingPeriod.monthsInPeriod + " month digital subscription",
      gift_start_date = "gift start date placeholder", // TODO need to pull it through from when we create the sub
      gift_recipient_email = user.primaryEmailAddress,
      gift_end_date = "gift end date placeholder", // TODO need to pull it through from when we create the sub
    ))

  private def corpRedemption(subscriptionNumber: String) =
    wrap("digipack-corporate-redemption", directOrCorpFields("Group subscription", subscriptionNumber))

  private def directThankYou(directPurchase: DigitalSubscriptionDirectPurchaseCreated)(implicit ec: ExecutionContext) = {

    val promotion = paperFieldsGenerator.getAppliedPromotion(
      directPurchase.purchaseInfo.promoCode,
      user.billingAddress.country,
      ProductTypeRatePlans.digitalRatePlan(directPurchase.product, touchPointEnvironment).map(_.id).getOrElse("")
    )
    digitalPackPaymentEmailFields.paymentFields(
      directPurchase.purchaseInfo.paymentMethod,
      directPurchase.purchaseInfo.accountNumber
    ).map(paymentFieldsAttributes =>
      wrap("digipack", DirectDSAttributes(
        directOrCorpFields(
          SubscriptionEmailFieldHelpers.describe(directPurchase.purchaseInfo.paymentSchedule, directPurchase.product, promotion),
          directPurchase.purchaseInfo.subscriptionNumber
        ),
        country = user.billingAddress.country.name,
        date_of_first_payment = formatDate(SubscriptionEmailFieldHelpers.firstPayment(directPurchase.purchaseInfo.paymentSchedule).date),
        trial_period = "14", //TODO: depends on Promo code or zuora config
        paymentFieldsAttributes
      ))
    )
  }

}

class DigitalPackPaymentEmailFields(getMandate: String => Future[Option[String]]) {

  def paymentFields(paymentMethod: PaymentMethod, accountNumber: String)(implicit ec: ExecutionContext): Future[PaymentFieldsAttributes] =
    paymentMethod match {
      case dd: DirectDebitPaymentMethod => getMandate(accountNumber).map(directDebitMandateId => DDAttributes(
        account_number = mask(dd.bankTransferAccountNumber),
        sort_code = hyphenate(dd.bankCode),
        account_name = dd.bankTransferAccountName,
        mandateid = directDebitMandateId.getOrElse("")
      ))
      case dd: ClonedDirectDebitPaymentMethod => Future.successful(DDAttributes(
        sort_code = hyphenate(dd.bankCode),
        account_number = mask(dd.bankTransferAccountNumber),
        account_name = dd.bankTransferAccountName,
        mandateid = dd.mandateId
      ))
      case _: CreditCardReferenceTransaction => Future.successful(CCAttributes())
      case _: PayPalReferenceTransaction => Future.successful(PPAttributes())
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
