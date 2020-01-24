package controllers

import actions.CustomActionBuilders
import admin.settings.SwitchState.On
import admin.settings._
import assets.RefPath
import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{NoFulfilmentOptions, NoProductOptions}
import com.gu.support.config._
import com.gu.support.pricing.{PriceSummary, PriceSummaryService, PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.Monthly
import com.gu.tip.Tip
import com.typesafe.config.ConfigFactory
import config.Configuration.MetricUrl
import config.StringsConfig
import fixtures.TestCSRFComponents
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.when
import org.scalatest.OptionValues._
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import org.scalatestplus.mockito.MockitoSugar.mock
import play.api.mvc.Result
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, status, stubControllerComponents, _}
import services.MembersDataService._
import services.stepfunctions.SupportWorkersClient
import services.{AccessCredentials, IdentityService, MembersDataService, TestUserService}

import scala.concurrent.Future

class SubscriptionsTest extends AnyWordSpec with Matchers with TestCSRFComponents {

  val appConf = ConfigFactory.load("DEV.public.conf")

  trait DigitalSubscriptionsDisplayForm extends DisplayFormMocks {

    import scala.concurrent.ExecutionContext.Implicits.global

    def mockedMembersDataService(hasFailed: Boolean, hasDp: Boolean): MembersDataService = {
      val membersDataService: MembersDataService = mock[MembersDataService]
      val errorResponse: MembersDataServiceError = UnexpectedResponseStatus(500)
      val successResponseWithDp: UserAttributes = UserAttributes("0", ContentAccess(
        recurringContributor = false,
        digitalPack = true
      ))
      val successResponseWithoutDp: UserAttributes = UserAttributes("0", ContentAccess(
        recurringContributor = false,
        digitalPack = false
      ))
      when(membersDataService.userAttributes(any[AccessCredentials.Cookies])).thenReturn(
        if (hasFailed) {
          EitherT.leftT[Future, UserAttributes](errorResponse)
        } else if (hasDp) {
          EitherT.rightT[Future, MembersDataServiceError](successResponseWithDp)
        } else {
          EitherT.rightT[Future, MembersDataServiceError](successResponseWithoutDp)
        }
      )
      membersDataService
    }

    val amounts = Amounts(Nil, Nil, Nil)
    val allSettings = AllSettings(
      Switches(
        oneOffPaymentMethods = PaymentMethodsSwitch(On, On, On, On, None, None, None, None),
        recurringPaymentMethods = PaymentMethodsSwitch(On, On, On, On, Some(On), Some(On), Some(On), None),
        experiments = Map.empty
      ),
      AmountsRegions(amounts, amounts, amounts, amounts, amounts, amounts, amounts),
      ContributionTypes(Nil, Nil, Nil, Nil, Nil, Nil, Nil),
      MetricUrl("http://localhost")
    )

    def fakeDigitalPack(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: IdentityService = mockedIdentityService(authenticatedIdUser.minimalUser -> idUser.asRight[String]),
      membersDataService: MembersDataService = mockedMembersDataService(hasFailed = false, hasDp = false)
    ): DigitalSubscription = {
      val settingsProvider = mock[AllSettingsProvider]
      when(settingsProvider.getAllSettings()).thenReturn(allSettings)
      val client = mock[SupportWorkersClient]
      val testUserService = mock[TestUserService]
      val tip = mock[Tip]
      val stripe = mock[StripeConfigProvider]
      val stripeAccountConfig = StripeAccountConfig("", "")
      when(stripe.get(any[Boolean])).thenReturn(
        StripeConfig(stripeAccountConfig, stripeAccountConfig, stripeAccountConfig, None)
      )
      val payPal = mock[PayPalConfigProvider]
      when(payPal.get(any[Boolean])).thenReturn(PayPalConfig("", "", "", "", "", ""))

      val prices: ProductPrices = Map(
        CountryGroup.UK ->
          Map(NoFulfilmentOptions ->
            Map(NoProductOptions ->
              Map(Monthly ->
                Map(GBP -> PriceSummary(10, 0, GBP, fixedTerm = false, Nil))))))
      val priceSummaryServiceProvider = mock[PriceSummaryServiceProvider]
      val priceSummaryService = mock[PriceSummaryService]
      when(priceSummaryService.getPrices(any[com.gu.support.catalog.Product], any[List[PromoCode]], any[Boolean])).thenReturn(prices)
      when(priceSummaryServiceProvider.forUser(any[Boolean])).thenReturn(priceSummaryService)

      new DigitalSubscription(
        priceSummaryServiceProvider = priceSummaryServiceProvider,
        assets = assetResolver,
        actionRefiners = actionRefiner,
        identityService = identityService,
        testUsers = testUserService,
        membersDataService = membersDataService,
        stripeConfigProvider = stripe,
        payPalConfigProvider = payPal,
        components = stubControllerComponents(),
        stringsConfig = new StringsConfig(),
        settingsProvider = settingsProvider,
        supportUrl = "support.thegulocal.com",
        fontLoaderBundle = Left(RefPath("test")),
        stripeSetupIntentEndpoint = appConf.getString("stripe.intent.url")
      )
    }

    def fakeRequestAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: IdentityService = mockedIdentityService(authenticatedIdUser.minimalUser -> idUser.asRight[String]),
      membersDataService: MembersDataService = mockedMembersDataService(hasFailed = false, hasDp = false)
    ): Future[Result] = {
      fakeDigitalPack(actionRefiner, identityService, membersDataService).displayForm()(FakeRequest())
    }
  }

  "GET subscribe/digital/checkout" should {

    "redirect unauthenticated user to signup page" in new DigitalSubscriptionsDisplayForm {

      when(asyncAuthenticationService.authenticateUser(any())).thenReturn(Future.failed(new RuntimeException))

      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedOutActionRefiner)
      status(result) mustBe 303
      header("Location", result).value must startWith("https://identity-url.local")
    }

    "redirect user with a dp to ty page" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.authenticateUser(any()))
        .thenReturn(Future.successful(authenticatedIdUser))

      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(hasFailed = false, hasDp = true)
      )
      status(result) mustBe 302
      header("Location", result).value must endWith("thankyou-existing")
    }

    "return a 500 if the call to get additional data from identity fails" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.authenticateUser(any()))
        .thenReturn(Future.successful(authenticatedIdUser))

      val result = fakeRequestAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.minimalUser -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "not redirect users if membersDataService errors" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.authenticateUser(any()))
        .thenReturn(Future.successful(authenticatedIdUser))

      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(hasFailed = true, hasDp = true)
      )
      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }

    "return form if user is signed in and call to identity is successful" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.authenticateUser(any()))
        .thenReturn(Future.successful(authenticatedIdUser))

      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedInActionRefiner)

      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }

  }
}
