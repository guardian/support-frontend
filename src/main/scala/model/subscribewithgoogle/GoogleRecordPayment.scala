package model.subscribewithgoogle

import io.circe.generic.JsonCodec
import model.PaymentStatus

@JsonCodec case class GoogleRecordPayment(firstName: String,
                                          email: String,
                                          status: PaymentStatus,
                                          amount: BigDecimal,
                                          currency: String,
                                          countryCode: String,
                                          paymentId: String,
                                          receivedTimestamp: Long)
