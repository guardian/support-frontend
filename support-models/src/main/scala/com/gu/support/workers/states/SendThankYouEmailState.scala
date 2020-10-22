package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.states.ProductTypeCreated.DigitalSubscriptionCreated._
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import org.joda.time.LocalDate

case class SendThankYouEmailState(
  requestId: UUID,
  user: User,
  analyticsInfo: AnalyticsInfo,
  productTypeCreated: ProductTypeCreated,
  salesForceContact: SalesforceContactRecord,
  acquisitionData: Option[AcquisitionData]
) extends SendAcquisitionEventState

case class PurchaseInfo(
  paymentMethod: PaymentMethod,
  paymentSchedule: PaymentSchedule,
  promoCode: Option[PromoCode],
  accountNumber: String,
  subscriptionNumber: String,
)
object PurchaseInfo {
  implicit val codec: Codec[PurchaseInfo] = deriveCodec
}

sealed trait ProductTypeCreated {
  def product: ProductType
}

object ProductTypeCreated {

  case class ContributionCreated(
    product: Contribution,
    purchaseInfo: PurchaseInfo,
  ) extends ProductTypeCreated

  sealed trait DigitalSubscriptionCreated extends ProductTypeCreated {
    override def product: DigitalPack
  }

  sealed trait PurchaseCreated {
    def purchaseInfo: PurchaseInfo
  }

  object DigitalSubscriptionCreated {

    case class DigitalSubscriptionDirectPurchaseCreated(
      product: DigitalPack,
      purchaseInfo: PurchaseInfo,
    ) extends DigitalSubscriptionCreated with PurchaseCreated

    case class DigitalSubscriptionGiftPurchaseCreated(
      product: DigitalPack,
      giftRecipient: DigitalSubscriptionGiftRecipient,
      giftCode: GeneratedGiftCode,
      lastRedemptionDate: LocalDate,
      purchaseInfo: PurchaseInfo,
    ) extends DigitalSubscriptionCreated with PurchaseCreated

    case class DigitalSubscriptionCorporateRedemptionCreated(
      product: DigitalPack,
      subscriptionNumber: String,
    ) extends DigitalSubscriptionCreated

    case class DigitalSubscriptionGiftRedemptionCreated( //tbc
      product: DigitalPack,
    ) extends DigitalSubscriptionCreated

  }

  case class PaperCreated(
    product: Paper,
    purchaseInfo: PurchaseInfo,
    firstDeliveryDate: LocalDate,
  ) extends ProductTypeCreated with PurchaseCreated

  case class GuardianWeeklyCreated(
    product: GuardianWeekly,
    giftRecipient: Option[WeeklyGiftRecipient],
    purchaseInfo: PurchaseInfo,
    firstDeliveryDate: LocalDate,
  ) extends ProductTypeCreated with PurchaseCreated

  private val discriminatedType = new DiscriminatedType[ProductTypeCreated]("productTypeCreatedType")
  implicit val codec = discriminatedType.codec(List(
    discriminatedType.variant[ContributionCreated]("Contribution"),
    discriminatedType.variant[DigitalSubscriptionDirectPurchaseCreated]("DigitalSubscriptionDirectPurchase"),
    discriminatedType.variant[DigitalSubscriptionGiftPurchaseCreated]("DigitalSubscriptionGiftPurchase"),
    discriminatedType.variant[DigitalSubscriptionCorporateRedemptionCreated]("DigitalSubscriptionCorporateRedemption"),
    discriminatedType.variant[DigitalSubscriptionGiftRedemptionCreated]("DigitalSubscriptionGiftRedemption"),
    discriminatedType.variant[PaperCreated]("Paper"),
    discriminatedType.variant[GuardianWeeklyCreated]("GuardianWeekly"),
  ))

}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendThankYouEmailState {
  implicit val codec: Codec[SendThankYouEmailState] = deriveCodec
}
