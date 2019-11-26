package com.gu.monitoring

object LambdaExecutionResultFixtures {
  val successfulContribution =
    """
    {
      "requestId" : "e18f6418-45f2-11e7-8bfa-8faac2182601",
      "status" : "Success",
      "isTestUser" : false,
      "paymentDetails" : "PayPal",
      "firstDeliveryDate" : null,
      "isGift" : false,
      "promoCode" : null,
      "billingCountry" : "GB",
      "deliveryCountry" : null,
      "checkoutFailureReason" : null,
      "error" : null,
      "amount" : 20,
      "productType" : "Contribution",
      "currency" : "GBP",
      "billingPeriod" : "Monthly"
    }
    """
}
