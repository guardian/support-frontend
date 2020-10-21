package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.encoding.CustomCodecs._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.GiftRecipient.{DigitalSubscriptionGiftRecipient, WeeklyGiftRecipient}
import com.gu.support.workers.states.ProductTypeCreated.DigitalSubscriptionCreated._
import com.gu.support.workers.states.ProductTypeCreated.{ContributionCreated, GuardianWeeklyCreated, PaperCreated}
import com.gu.support.workers.{PaymentMethod, SalesforceContactRecord, User, _}
import io.circe.syntax.EncoderOps
import io.circe.{Decoder, Encoder}
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

  val circeDiscriminator = new CirceDiscriminator("productTypeCreatedType")

  private val discriminatorContribution = "Contribution"
  private val discriminatorDigitalSubscriptionDirectPurchase = "DigitalSubscriptionDirectPurchase"
  private val discriminatorDigitalSubscriptionGiftPurchase = "DigitalSubscriptionGiftPurchase"
  private val discriminatorDigitalSubscriptionCorporateRedemption = "DigitalSubscriptionCorporateRedemption"
  private val discriminatorDigitalSubscriptionGiftRedemption = "DigitalSubscriptionGiftRedemption"
  private val discriminatorPaper = "Paper"
  private val discriminatorGuardianWeekly = "GuardianWeekly"

  implicit val c1 = circeDiscriminator.discriminatedCodec[ContributionCreated](discriminatorContribution)
  implicit val c2 = circeDiscriminator.discriminatedCodec[DigitalSubscriptionDirectPurchaseCreated](discriminatorDigitalSubscriptionDirectPurchase)
  implicit val c3 = circeDiscriminator.discriminatedCodec[DigitalSubscriptionGiftPurchaseCreated](discriminatorDigitalSubscriptionGiftPurchase)
  implicit val c4 = circeDiscriminator.discriminatedCodec[DigitalSubscriptionCorporateRedemptionCreated](discriminatorDigitalSubscriptionCorporateRedemption)
  implicit val c5 = circeDiscriminator.discriminatedCodec[DigitalSubscriptionGiftRedemptionCreated](discriminatorDigitalSubscriptionGiftRedemption)
  implicit val c6 = circeDiscriminator.discriminatedCodec[PaperCreated](discriminatorPaper)
  implicit val c7 = circeDiscriminator.discriminatedCodec[GuardianWeeklyCreated](discriminatorGuardianWeekly)

  implicit val encoder: Encoder[ProductTypeCreated] = Encoder.instance {
    case c: ContributionCreated => c.asJson
    case c: DigitalSubscriptionDirectPurchaseCreated => c.asJson
    case c: DigitalSubscriptionGiftPurchaseCreated => c.asJson
    case c: DigitalSubscriptionCorporateRedemptionCreated => c.asJson
    case c: DigitalSubscriptionGiftRedemptionCreated => c.asJson
    case c: PaperCreated => c.asJson
    case c: GuardianWeeklyCreated => c.asJson
  }

  implicit val decoder =
    circeDiscriminator.decode[ProductTypeCreated](Map(
      discriminatorContribution -> Decoder[ContributionCreated],
      discriminatorDigitalSubscriptionDirectPurchase -> Decoder[DigitalSubscriptionDirectPurchaseCreated],
      discriminatorDigitalSubscriptionGiftPurchase -> Decoder[DigitalSubscriptionGiftPurchaseCreated],
      discriminatorDigitalSubscriptionCorporateRedemption -> Decoder[DigitalSubscriptionCorporateRedemptionCreated],
      discriminatorDigitalSubscriptionGiftRedemption -> Decoder[DigitalSubscriptionGiftRedemptionCreated],
      discriminatorPaper -> Decoder[PaperCreated],
      discriminatorGuardianWeekly -> Decoder[GuardianWeeklyCreated],
    ))
}

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._

object SendThankYouEmailState {
  implicit val codec: Codec[SendThankYouEmailState] = deriveCodec
}
