package model.paypal

import io.circe.generic.JsonCodec
import model.{AcquisitionData, Currency}
import io.circe.Decoder
import io.circe.generic.semiauto._
import model.IdentityData
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}

object PaypalJsonDecoder {

  import controllers.JsonReadableOps._

  implicit val executePaypalPaymentDataDecoder: Decoder[ExecutePaypalPaymentData] =
    deriveDecoder[ExecutePaypalPaymentData]

  private val legacyCapturePaypalPaymentDataDecoder: Decoder[CapturePaypalPaymentData] = Decoder.instance { cursor =>
    import cursor._
    for {
      paymentId <- downField("paymentId").as[String]
      visitId <- downField("ophanVisitId").as[Option[String]]
      browserId <- downField("ophanBrowserId").as[Option[String]]
      platform <- downField("platform").as[Option[String]]
      cmp <- downField("cmp").as[Option[String]]
      intcmp <- downField("intCmp").as[Option[String]]
      refererPageviewId <- downField("refererPageviewId").as[Option[String]]
      refererUrl <- downField("refererUrl").as[Option[String]]
      ophanPageviewId <- downField("ophanPageviewId").as[Option[String]]
      componentId <- downField("componentId").as[Option[String]]
      componentType <- downField("componentType").as[Option[ComponentType]]
      source <- downField("source").as[Option[AcquisitionSource]]
      identityId <- downField("idUser").as[Option[String]]
      email <- downField("email").as[Option[String]]
      abTest <- downField("abTest").as[Option[AbTest]]
      refererAbTest <- downField("refererAbTest").as[Option[AbTest]]
      nativeAbTests <- downField("nativeAbTests").as[Option[Set[AbTest]]]
    } yield {
      CapturePaypalPaymentData(
        paymentData = CapturePaymentData(
          paymentId = paymentId
        ),
        acquisitionData = AcquisitionData(
          platform = platform,
          visitId = visitId,
          browserId = browserId,
          pageviewId = ophanPageviewId,
          referrerPageviewId = refererPageviewId,
          referrerUrl = refererUrl,
          componentId = componentId,
          campaignCodes = Option(Set(cmp, intcmp).flatten).filter(_.nonEmpty),
          componentType = componentType,
          source = source,
          abTests = Option(Set(abTest, refererAbTest).flatten ++ nativeAbTests
            .getOrElse(Set[AbTest]()))
            .filter(_.nonEmpty)
        ),
        identityData = IdentityData(
          identityId = identityId,
          email = email
        )
      )
    }
  }

  implicit val capturePaypalPaymentDataDecoder: Decoder[CapturePaypalPaymentData] =
    legacyCapturePaypalPaymentDataDecoder.or(deriveDecoder[CapturePaypalPaymentData])

}

/*
 * Create paypal payment
 * Only used by Web, Apps have a different paypal flow.
 * Web: create paypal payment (sale) -> execute
 * App: create paypal payment (auth directly form mobile app) -> capture
 */
@JsonCodec case class CreatePaypalPaymentData(
  currency: Currency,
  amount: BigDecimal,
  returnURL: String,
  cancelURL: String
)

@JsonCodec case class CapturePaymentData(
  paymentId: String
)

case class CapturePaypalPaymentData(
  paymentData: CapturePaymentData,
  acquisitionData: AcquisitionData,
  identityData: IdentityData
)

@JsonCodec case class ExecutePaymentData(
  paymentId: String,
  payerId: String
)

case class ExecutePaypalPaymentData(
  paymentData: ExecutePaymentData,
  acquisitionData: AcquisitionData,
  identityData: IdentityData
)