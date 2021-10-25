package controllers

import actions.CustomActionBuilders
import admin.settings.SwitchState.{Off, On}
import admin.settings._
import assets.RefPath
import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.CountryGroup
import com.gu.i18n.Currency.GBP
import com.gu.support.catalog.{NoFulfilmentOptions, NoProductOptions}
import com.gu.support.config._
import com.gu.support.pricing.{PriceSummary, PriceSummaryService, PriceSummaryServiceProvider, ProductPrices}
import com.gu.support.promotions.{PromoCode, PromotionServiceProvider}
import com.gu.support.workers.Monthly
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Direct
import com.typesafe.config.ConfigFactory
import config.Configuration.MetricUrl
import config.{RecaptchaConfigProvider, RecaptchaConfig, StringsConfig}
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

    val amount = 25
    val selection = AmountsSelection(amounts = List(amount), defaultAmount = 25)
    val contributionAmounts = ContributionAmounts(
      ONE_OFF = selection,
      MONTHLY = selection,
      ANNUAL = selection
    )
    val configuredRegionAmounts = ConfiguredRegionAmounts(
      control = contributionAmounts,
      test = None,
    )
    val configuredAmounts = ConfiguredAmounts(
      GBPCountries = configuredRegionAmounts,
      UnitedStates = configuredRegionAmounts,
      EURCountries = configuredRegionAmounts,
      AUDCountries = configuredRegionAmounts,
      International = configuredRegionAmounts,
      NZDCountries = configuredRegionAmounts,
      Canada = configuredRegionAmounts
    )

    val contributionTypesSettings = List(
      ContributionTypeSetting(
        contributionType = ONE_OFF,
        isDefault = Some(true)
      )
    )
    val contributionTypes = ContributionTypes(
      GBPCountries = contributionTypesSettings,
      UnitedStates = contributionTypesSettings,
      EURCountries = contributionTypesSettings,
      AUDCountries = contributionTypesSettings,
      International = contributionTypesSettings,
      NZDCountries = contributionTypesSettings,
      Canada = contributionTypesSettings
    )

    val allSettings = AllSettings(
      Switches(
        oneOffPaymentMethods = PaymentMethodsSwitch(On, On, On, On, None, None, None, None, None),
        recurringPaymentMethods = PaymentMethodsSwitch(On, On, On, On, Some(On), Some(On), Some(On), None, None),
        experiments = Map.empty,
        enableDigitalSubGifting = On,
        useDotcomContactPage = Some(SwitchState.Off),
        enableRecaptchaBackend = Off,
        enableRecaptchaFrontend = Off,
        enableContributionsCampaign = On,
        forceContributionsCampaign = On
      ),
      configuredAmounts,
      ContributionTypes(Nil, Nil, Nil, Nil, Nil, Nil, Nil),
      MetricUrl("http://localhost")
    )

    def fakeDigitalPack(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: IdentityService = mockedIdentityService(authenticatedIdUser.minimalUser -> idUser.asRight[String]),
      membersDataService: MembersDataService = mockedMembersDataService(hasFailed = false, hasDp = false)
    ): DigitalSubscriptionFormController = {
      val settingsProvider = mock[AllSettingsProvider]
      when(settingsProvider.getAllSettings()).thenReturn(allSettings)
      val client = mock[SupportWorkersClient]
      val testUserService = mock[TestUserService]
      val stripe = mock[StripeConfigProvider]
      val stripeAccountConfig = StripeAccountConfig("", "")
      when(stripe.get(any[Boolean])).thenReturn(
        StripeConfig(stripeAccountConfig, stripeAccountConfig, stripeAccountConfig, None))
      val payPal = mock[PayPalConfigProvider]
      when(payPal.get(any[Boolean])).thenReturn(PayPalConfig("", "", "", "", "", ""))
      val recaptchaConfigProvider = mock[RecaptchaConfigProvider]
      when(recaptchaConfigProvider.get(any[Boolean])).thenReturn(RecaptchaConfig("",""))

      val prices: ProductPrices = Map(
        CountryGroup.UK ->
          Map(NoFulfilmentOptions ->
            Map(NoProductOptions ->
              Map(Monthly ->
                Map(GBP -> PriceSummary(10, None, GBP, fixedTerm = false, Nil))))))
      val priceSummaryServiceProvider = mock[PriceSummaryServiceProvider]
      val promotionServiceProvider = mock[PromotionServiceProvider]
      val priceSummaryService = mock[PriceSummaryService]
      val stage = mock[Stage]
      when(priceSummaryService.getPrices(any[com.gu.support.catalog.Product], any[List[PromoCode]], any[ReaderType])).thenReturn(prices)
      when(priceSummaryServiceProvider.forUser(any[Boolean])).thenReturn(priceSummaryService)

      new DigitalSubscriptionFormController(
        priceSummaryServiceProvider = priceSummaryServiceProvider,
        assets = assetResolver,
        actionRefiners = actionRefiner,
        identityService = identityService,
        testUsers = testUserService,
        membersDataService = membersDataService,
        stripeConfigProvider = stripe,
        payPalConfigProvider = payPal,
        components = stubControllerComponents(),
        settingsProvider = settingsProvider,
        recaptchaConfigProvider
      )
    }

    def fakeRequestAuthenticatedWith(
      actionRefiner: CustomActionBuilders = loggedInActionRefiner,
      identityService: IdentityService = mockedIdentityService(authenticatedIdUser.minimalUser -> idUser.asRight[String]),
      membersDataService: MembersDataService = mockedMembersDataService(hasFailed = false, hasDp = false)
    ): Future[Result] = {
      fakeDigitalPack(actionRefiner, identityService, membersDataService).displayForm(false)(FakeRequest())
    }
  }

  "GET subscribe/digital/checkout" should {
//    TODO: We have an outstanding card to work out what to do with existing subscribers
//    "redirect user with a dp to ty page" in new DigitalSubscriptionsDisplayForm {
//      when(asyncAuthenticationService.tryAuthenticateUser(any()))
//        .thenReturn(Future.successful(Some(authenticatedIdUser)))
//
//      val result = fakeRequestAuthenticatedWith(
//        membersDataService = mockedMembersDataService(hasFailed = false, hasDp = true)
//      )
//      status(result) mustBe 302
//      header("Location", result).value must endWith("thankyou-existing")
//    }

    "return a 500 if the call to get additional data from identity fails" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(authenticatedIdUser)))

      val result = fakeRequestAuthenticatedWith(
        identityService = mockedIdentityService(authenticatedIdUser.minimalUser -> "not found".asLeft)
      )
      status(result) mustBe 500
    }

    "not redirect users if membersDataService errors" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(authenticatedIdUser)))

      val result = fakeRequestAuthenticatedWith(
        membersDataService = mockedMembersDataService(hasFailed = true, hasDp = true)
      )
      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }

    "return form if user is signed in and call to identity is successful" in new DigitalSubscriptionsDisplayForm {
      when(asyncAuthenticationService.tryAuthenticateUser(any()))
        .thenReturn(Future.successful(Some(authenticatedIdUser)))

      val result = fakeRequestAuthenticatedWith(actionRefiner = loggedInActionRefiner)

      status(result) mustBe 200
      contentAsString(result) must include("digitalSubscriptionCheckoutPage.js")
    }

  }
}
