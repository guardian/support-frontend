package model.subscribewithgoogle

import io.circe.generic.JsonCodec

@JsonCodec case class GoogleRecordPayment(firstName: String,
                                          email: String,
                                          status: String,
                                          amount: BigDecimal,
                                          currency: String,
                                          countryCode: String,
                                          paymentId: String,
                                          receivedTimestamp: Long)
