package model.subscribewithgoogle

import io.circe.generic.JsonCodec
import model.PaymentStatus


//todo: This model is likely to change as part of any stats tracking work that needs to be done.
@JsonCodec case class GoogleRecordPayment(firstName: String,
                                          email: String,
                                          status: PaymentStatus,
                                          amount: BigDecimal,
                                          currency: String,
                                          countryCode: String,
                                          paymentId: String,
                                          receivedTimestamp: Long)
