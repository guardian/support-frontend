package utils

import com.gu.support.acquisitions.AbTest
import com.gu.support.workers.states.CreatePaymentMethodState

case object SupportWorkersUtils {
  def buildExecutionName(state: CreatePaymentMethodState): String = {
    val name = (if (state.user.isTestUser) "TestUser-" else "") +
      state.product.describe + "-" +
      state.paymentFields.describe

    val isPayPalCPTestVariant = (abTest: AbTest) =>
      abTest.name == "paypalCompletePaymentsWithBAID" && abTest.variant == "variant"

    if (state.acquisitionData.exists(_.supportAbTests.exists(isPayPalCPTestVariant))) {
      name.replace("PayPal", "PayPalCPWithBAID")
    } else {
      name
    }
  }
}
