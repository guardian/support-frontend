package model.amazonpay

import io.circe.generic.JsonCodec
import io.circe.generic.semiauto._
import model.{AcquisitionData, Currency}

@JsonCodec case class AmazonPaymentData(orderReferenceId: String, amount: BigDecimal, currency: Currency, email: String)

object BundledAmazonPayRequest {
  case class AmazonPayRequest(paymentData: AmazonPaymentData, acquisitionData: Option[AcquisitionData])

  import controllers.JsonReadableOps._
  implicit val bundledAmazonPayRequestDecoder = deriveDecoder[AmazonPayRequest]
}
