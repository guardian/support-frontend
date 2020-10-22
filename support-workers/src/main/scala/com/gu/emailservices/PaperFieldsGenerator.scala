package com.gu.emailservices

import com.gu.i18n.{Country, Currency}
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.promotions.{PromoCode, Promotion, PromotionService}
import com.gu.support.workers._
import com.gu.support.workers.states.PurchaseInfo
import org.joda.time.LocalDate

import scala.concurrent.{ExecutionContext, Future}

class PaperFieldsGenerator(
  promotionService: PromotionService,
  getMandate: String => Future[Option[String]],
) {

  def getAppliedPromotion(
    maybePromoCode: Option[PromoCode],
    country: Country,
    productRatePlanId: ProductRatePlanId,
  ): Option[Promotion] =
    for {
      promoCode <- maybePromoCode
      promotionWithCode <- promotionService.findPromotion(promoCode).toOption
      validPromotion <- promotionService.validatePromotion(promotionWithCode, country, productRatePlanId, isRenewal = false).toOption
    } yield validPromotion.promotion

  def fieldsFor(
    purchaseInfo: PurchaseInfo,
    product: ProductType,
    user: User,
    productRatePlanId: Option[ProductRatePlanId],
    fixedTerm: Boolean,
    firstDeliveryDate: LocalDate,
  )(implicit ec: ExecutionContext): Future[List[(String, String)]] = {

    val promotion = getAppliedPromotion(
      purchaseInfo.promoCode,
      user.billingAddress.country,
      productRatePlanId.getOrElse(""),
    )

    val firstPaymentDate = SubscriptionEmailFieldHelpers.firstPayment(purchaseInfo.paymentSchedule).date

    val deliveryAddressFields = getAddressFields(user)

    val paymentDescription = SubscriptionEmailFieldHelpers.describe(
      purchaseInfo.paymentSchedule,
      product,
      promotion,
      fixedTerm
    )

    val basicFields = List(
      "ZuoraSubscriberId" -> purchaseInfo.subscriptionNumber,
      "EmailAddress" -> user.primaryEmailAddress,
      "subscriber_id" -> purchaseInfo.subscriptionNumber,
      "first_name" -> user.firstName,
      "last_name" -> user.lastName,
      "date_of_first_paper" -> SubscriptionEmailFieldHelpers.formatDate(firstDeliveryDate),
      "date_of_first_payment" -> SubscriptionEmailFieldHelpers.formatDate(firstPaymentDate),
      "subscription_rate" -> paymentDescription
    )

    for {
      paymentFields <- getPaymentFields(purchaseInfo.paymentMethod, purchaseInfo.accountNumber)
    } yield basicFields ++ paymentFields ++ deliveryAddressFields

  }

  protected def getAddressFields(user: User)= {
    val address = user.deliveryAddress.getOrElse(user.billingAddress)

    List(
      "delivery_address_line_1" -> address.lineOne.getOrElse(""),
      "delivery_address_line_2" -> address.lineTwo.getOrElse(""),
      "delivery_address_town" -> address.city.getOrElse(""),
      "delivery_postcode" -> address.postCode.getOrElse(""),
      "delivery_country" -> address.country.name
    )
  }

  protected def getPaymentFields(
    paymentMethod: PaymentMethod,
    accountNumber: String
  )(implicit ec: ExecutionContext): Future[Seq[(String, String)]] = paymentMethod match {
    case dd: DirectDebitPaymentMethod => getMandate(accountNumber).map(directDebitMandateId => List(
      "bank_account_no" -> SubscriptionEmailFieldHelpers.mask(dd.bankTransferAccountNumber),
      "bank_sort_code" -> SubscriptionEmailFieldHelpers.hyphenate(dd.bankCode),
      "account_holder" -> dd.bankTransferAccountName,
      "payment_method" -> "Direct Debit",
      "mandate_id" -> directDebitMandateId.getOrElse("")
    ))
    case dd: ClonedDirectDebitPaymentMethod => Future.successful(List(
      "bank_account_no" -> SubscriptionEmailFieldHelpers.mask(dd.bankTransferAccountNumber),
      "bank_sort_code" -> SubscriptionEmailFieldHelpers.hyphenate(dd.bankCode),
      "account_holder" -> dd.bankTransferAccountName,
      "payment_method" -> "Direct Debit",
      "mandate_id" -> dd.mandateId
    ))
    case _: CreditCardReferenceTransaction => Future.successful(List("payment_method" -> "Credit/Debit Card"))
    case _: PayPalReferenceTransaction => Future.successful(List("payment_method" -> "PayPal"))
  }

}
