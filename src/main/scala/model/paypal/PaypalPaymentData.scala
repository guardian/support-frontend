package model.paypal

import io.circe.generic.JsonCodec
import model.Currency

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
    cancelURL: String)



/*
 * Capture paypal payment (payment has been created previously by Apps)
 */
import io.circe.Decoder
import io.circe.generic.semiauto._
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}
import com.gu.fezziwig.CirceScroogeMacros._

@JsonCodec case class IdentityId(id: String)

case class CapturePaypalPaymentData (
    paymentId: String,
    platform: String,
    idUser: Option[IdentityId],
    intCmp: Option[String],
    refererPageviewId: Option[String],
    refererUrl: Option[String],
    ophanPageviewId: Option[String],
    ophanBrowserId: Option[String],
    componentId: Option[String],
    componentType: Option[ComponentType],
    source: Option[AcquisitionSource],
    refererAbTest: Option[AbTest],
    nativeAbTests: Option[Set[AbTest]])

object CapturePaypalPaymentData {
  implicit val componentTypeDecoder: Decoder[ComponentType] =
    decodeThriftEnum[ComponentType]
  implicit val acquisitionSourceDecoder: Decoder[AcquisitionSource] =
    decodeThriftEnum[AcquisitionSource]
  implicit val abTestDecoder: Decoder[AbTest] =
    decodeThriftStruct[AbTest]
  implicit val capturePaypalPaymentDataDecoder: Decoder[CapturePaypalPaymentData] =
    deriveDecoder[CapturePaypalPaymentData]

}