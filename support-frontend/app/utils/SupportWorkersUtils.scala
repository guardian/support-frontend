package utils

import com.gu.support.acquisitions.AbTest
import com.gu.support.workers.states.CreatePaymentMethodState

case object SupportWorkersUtils {
  def buildExecutionName(state: CreatePaymentMethodState): String = {
    (if (state.user.isTestUser) "TestUser-" else "") +
      state.product.describe + "-" +
      state.paymentFields.describe
  }
}
