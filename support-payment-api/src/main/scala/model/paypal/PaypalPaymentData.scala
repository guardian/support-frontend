package model.paypal

import com.gu.support.acquisitions.{AbTest, QueryParameter}
import io.circe.generic.JsonCodec
import model.{AcquisitionData, Currency}
import io.circe.Decoder
import io.circe.generic.semiauto._

object PaypalJsonDecoder {

  import controllers.JsonReadableOps._

  implicit val executePaypalPaymentDataDecoder: Decoder[ExecutePaypalPaymentData] =
    deriveDecoder[ExecutePaypalPaymentData]
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
    cancelURL: String,
)

@JsonCodec case class ExecutePaymentData(
    paymentId: String,
    payerId: String,
)

case class ExecutePaypalPaymentData(
    paymentData: ExecutePaymentData,
    acquisitionData: AcquisitionData,
    email: String,
)
