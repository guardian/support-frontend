package com.gu.support.workers

import java.util.UUID

import com.gu.support.workers.states.{DirectDebitDisplayFields, SendThankYouEmailState}
import org.scalatest.{AsyncFlatSpec, FlatSpec, Matchers}
import com.gu.i18n.Country.UK
import com.gu.i18n.Currency.GBP
import com.gu.support.workers.lambdas.SendThankYouEmail
import com.gu.zuora.ZuoraService
import org.mockito.Mock
import org.mockito.Mockito.when
import org.scalatest.mockito.MockitoSugar

import scala.concurrent.Future

class SendThankYouEmailSpec extends AsyncFlatSpec with Matchers with MockitoSugar {
  {
    "completePaymentMethod" should "add mandate id if missing from request" in {

      val directDebitWithoutMandateId = DirectDebitDisplayFields(
        bankAccountNumberMask = "********23",
        bankSortCode = "123456",
        bankAccountName = "someName",
        mandateId = None,
      )
      val user = User(
        id = "userId",
        primaryEmailAddress = "primary address",
        firstName = "first name",
        lastName = "last name",
        billingAddress = Address(
          lineOne = None,
          lineTwo = None,
          city = None,
          state = None,
          postCode = None,
          country = UK
        )
      )
      val noMandateState = SendThankYouEmailState(
        requestId = UUID.randomUUID(),
        user = user,
        product = Contribution(12, GBP, Monthly),
        paymentMethodDisplayFields = directDebitWithoutMandateId,
        firstDeliveryDate = None,
        salesForceContact = SalesforceContactRecord("id", "account"),
        accountNumber = "accountNumber",
        subscriptionNumber = "subNumber",
        paymentSchedule = PaymentSchedule(List.empty),
        acquisitionData = None
      )

      val mockZuoraService = mock[ZuoraService]
      when(mockZuoraService.getMandateIdFromAccountNumber("accountNumber")) thenReturn Future.successful(Some("mandateId"))

      val sendEmail = new SendThankYouEmail(null, null)

      val directDebitWithMandate = directDebitWithoutMandateId.copy(mandateId = Some("mandateId"))
      val stateWithMandate = noMandateState.copy(paymentMethodDisplayFields = directDebitWithMandate)


      val futureActual = sendEmail.ensureMandateIdInState(
        zuoraService = mockZuoraService,
        state = noMandateState
      )

      futureActual map { actual => actual shouldBe stateWithMandate }
    }
  }
}
