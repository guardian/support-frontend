package utils

import admin.settings.{On, RecurringPaymentMethodSwitches, SubscriptionsPaymentMethodSwitches, Switches}
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.monitoring.SafeLogging
import com.gu.support.abtests.BenefitsTest.isValidBenefitsTestPurchase
import com.gu.support.catalog.{Contribution, DigitalPack, GuardianWeekly, Paper, SupporterPlus, _}
import com.gu.support.paperround.CoverageEndpoint.{CO, RequestBody}
import com.gu.support.paperround.{AgentId, PaperRoundAPI}
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType
import services.stepfunctions.CreateSupportWorkersRequest
import services.stepfunctions.CreateSupportWorkersRequest.GiftRecipientRequest
import utils.CheckoutValidationRules._

import scala.concurrent.{ExecutionContext, Future}

object CheckoutValidationRules {

  sealed trait Result {
    def and(right: Result): Result = (this, right) match {
      case (Invalid(leftMessage), Invalid(rightMessage)) => Invalid(leftMessage + " and " + rightMessage)
      case (Valid, Valid) => Valid
      case (invalid: Invalid, Valid) => invalid
      case (Valid, invalid: Invalid) => invalid
    }
    def or(right: Result): Result = (this, right) match {
      case (Invalid(leftMessage), Invalid(rightMessage)) => Invalid(leftMessage + " and " + rightMessage)
      case (Valid, Valid) => Valid
      case (Invalid(_), Valid) => Valid
      case (Valid, Invalid(_)) => Valid
    }
  }
  case class Invalid(message: String) extends Result
  case object Valid extends Result
  def checkSubscriptionPaymentMethodEnabled(
      switches: SubscriptionsPaymentMethodSwitches,
      paymentFields: Either[PaymentFields, RedemptionData],
  ) = paymentFields match {
    case Left(_: PayPalPaymentFields) =>
      if (switches.paypal.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(_: DirectDebitPaymentFields) =>
      if (switches.directDebit.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(_: StripePaymentFields) =>
      if (switches.creditCard.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(_) => Invalid("Invalid Payment Method")
    case Right(_) => Valid
  }

  def checkContributionPaymentMethodEnabled(
      switches: RecurringPaymentMethodSwitches,
      paymentFields: Either[PaymentFields, RedemptionData],
  ) = paymentFields match {
    case Left(_: PayPalPaymentFields) =>
      if (switches.payPal.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(_: DirectDebitPaymentFields) =>
      if (switches.directDebit.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(_: SepaPaymentFields) =>
      if (switches.sepa.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(s: StripePaymentFields) =>
      s.stripePaymentType match {
        case Some(StripePaymentType.StripeApplePay) =>
          if (switches.stripeApplePay.contains(On)) Valid else Invalid("Invalid Payment Method")
        case Some(StripePaymentType.StripePaymentRequestButton) =>
          if (switches.stripePaymentRequestButton.contains(On)) Valid else Invalid("Invalid Payment Method")
        case Some(StripePaymentType.StripeCheckout) =>
          if (switches.stripe.contains(On)) Valid else Invalid("Invalid Payment Method")
        case None => Invalid("Invalid Payment Method")
      }
    case Left(_: AmazonPayPaymentFields) =>
      if (switches.amazonPay.contains(On)) Valid else Invalid("Invalid Payment Method")
    case Left(_: ExistingPaymentFields) =>
      // Return Valid for all existing payments because we can't tell whether the user has a direct debit or card but,
      // there are separate switches in the switchboards(RRCP-Reader Revenue Control Panel) for these
      Valid
    case Right(_) => Invalid("Invalid Payment Method")

  }
  def checkPaymentMethodEnabled(
      product: ProductType,
      paymentFields: Either[PaymentFields, RedemptionData],
      switches: Switches,
  ) =
    product match {
      case _: Contribution | _: SupporterPlus =>
        checkContributionPaymentMethodEnabled(
          switches.recurringPaymentMethods,
          paymentFields,
        )
      case _ =>
        checkSubscriptionPaymentMethodEnabled(
          switches.subscriptionsPaymentMethods,
          paymentFields,
        )
    }

  def validate(createSupportWorkersRequest: CreateSupportWorkersRequest): Result =
    (createSupportWorkersRequest.product match {
      case _: SupporterPlus => PaidProductValidation.passes(createSupportWorkersRequest)
      case d: DigitalPack => DigitalPackValidation.passes(createSupportWorkersRequest, d)
      case p: Paper => PaperValidation.passes(createSupportWorkersRequest, p.fulfilmentOptions)
      case _: GuardianWeekly => GuardianWeeklyValidation.passes(createSupportWorkersRequest)
      case _: TierThree =>
        GuardianWeeklyValidation.passes(
          createSupportWorkersRequest,
        ) // Tier three has the same fields as Guardian Weekly
      case _: Contribution => PaidProductValidation.passes(createSupportWorkersRequest)
    }) match {
      case Invalid(message) =>
        Invalid(s"validation of the request body failed with $message - body was $createSupportWorkersRequest")
      case Valid => Valid
    }

  implicit class WithMessage(isSuccess: Boolean) {
    def otherwise(message: String): Result =
      if (isSuccess) Valid else Invalid(message)
  }

}

object SimpleCheckoutFormValidation {

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Result =
    noEmptyNameFields(createSupportWorkersRequest.firstName, createSupportWorkersRequest.lastName) and
      noExcessivelyLongNameFields(createSupportWorkersRequest.firstName, createSupportWorkersRequest.lastName) and
      noFieldsHaveUnsupportedCharacters(createSupportWorkersRequest)

  private def noEmptyNameFields(firstName: String, lastName: String): Result =
    firstName.nonEmpty.otherwise("first name was empty") and
      lastName.nonEmpty.otherwise("last name was empty")

  private def noExcessivelyLongNameFields(firstName: String, lastName: String): Result =
    (firstName.length <= 40).otherwise("first name was longer than 40 chars") and
      (lastName.length <= 80).otherwise("last name was longer than 80 chars")

  def noFieldsHaveUnsupportedCharacters(request: CreateSupportWorkersRequest): Result =
    noFourByteUtf8Characters("firstName", request.firstName) and
      noFourByteUtf8Characters("lastName", request.lastName) and
      request.billingAddress.lineOne.map(noFourByteUtf8Characters("billingAddress.lineOne", _)).getOrElse(Valid) and
      request.billingAddress.lineTwo.map(noFourByteUtf8Characters("billingAddress.lineTwo", _)).getOrElse(Valid) and
      request.billingAddress.city.map(noFourByteUtf8Characters("billingAddress.city", _)).getOrElse(Valid) and
      request.billingAddress.state.map(noFourByteUtf8Characters("billingAddress.state", _)).getOrElse(Valid) and
      request.billingAddress.postCode.map(noFourByteUtf8Characters("billingAddress.postCode", _)).getOrElse(Valid) and
      request.deliveryAddress
        .flatMap(_.lineOne)
        .map(noFourByteUtf8Characters("deliveryAddress.lineOne", _))
        .getOrElse(Valid) and
      request.deliveryAddress
        .flatMap(_.lineTwo)
        .map(noFourByteUtf8Characters("deliveryAddress.lineTwo", _))
        .getOrElse(Valid) and
      request.deliveryAddress
        .flatMap(_.city)
        .map(noFourByteUtf8Characters("deliveryAddress.city", _))
        .getOrElse(Valid) and
      request.deliveryAddress
        .flatMap(_.state)
        .map(noFourByteUtf8Characters("deliveryAddress.state", _))
        .getOrElse(Valid) and
      request.deliveryAddress
        .flatMap(_.postCode)
        .map(noFourByteUtf8Characters("deliveryAddress.postCode", _))
        .getOrElse(Valid) and
      request.giftRecipient
        .map(_.firstName)
        .map(noFourByteUtf8Characters("giftRecipient.firstName", _))
        .getOrElse(Valid) and
      request.giftRecipient
        .map(_.lastName)
        .map(noFourByteUtf8Characters("giftRecipient.lastName", _))
        .getOrElse(Valid) and
      request.giftRecipient
        .flatMap(_.email)
        .map(noFourByteUtf8Characters("giftRecipient.email", _))
        .getOrElse(Valid) and
      request.giftRecipient
        .flatMap(_.message)
        .map(noFourByteUtf8Characters("giftRecipient.message", _))
        .getOrElse(Valid) and
      noFourByteUtf8Characters("email", request.email) and
      request.telephoneNumber.map(noFourByteUtf8Characters("telephoneNumber", _)).getOrElse(Valid) and
      request.deliveryInstructions.map(noFourByteUtf8Characters("deliveryInstructions", _)).getOrElse(Valid)

  /** Fail validation for characters that Zuora doesn’t support.
    *
    * Zuora’s subscribe endpoint breaks when it receives characters that require more than 3 bytes to represent in UTF-8
    * (which is the required encoding for JSON). Those characters are those above U+FFFF.
    */
  def noFourByteUtf8Characters(name: String, string: String): Result = {
    "^[\\u0000-\\uFFFF]*$".r
      .matches(string)
      .otherwise(
        s"""$name contains characters which require more than 3 bytes to represent
         |in UTF-8. These characters will break Zuora.""".stripMargin,
      )
  }
}

object PaidProductValidation {
  import AddressAndCurrencyValidationRules._
  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Result =
    SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) and
      hasValidPaymentDetailsForPaidProduct(createSupportWorkersRequest.paymentFields) and
      hasStateIfRequired(
        createSupportWorkersRequest.billingAddress.country,
        createSupportWorkersRequest.billingAddress.state,
      )

  def hasValidPaymentDetailsForPaidProduct(paymentDetails: Either[PaymentFields, RedemptionData]): Result =
    paymentDetails match {
      case Left(paymentFields) => noEmptyPaymentFields(paymentFields)
      case Right(redemptionData) => Invalid("paid product can't be a redemption")
    }

  def noEmptyPaymentFields(paymentFields: PaymentFields): Result = paymentFields match {
    case directDebitDetails: DirectDebitPaymentFields =>
      directDebitDetails.accountHolderName.nonEmpty.otherwise("DD account name missing") and
        directDebitDetails.accountNumber.nonEmpty.otherwise("DD account number missing") and
        directDebitDetails.sortCode.nonEmpty.otherwise("DD sort code missing")
    case _: StripePaymentFields => Valid // already validated in PaymentMethodId.apply
    case payPalDetails: PayPalPaymentFields => payPalDetails.baid.nonEmpty.otherwise("paypal BAID missing")
    case existingDetails: ExistingPaymentFields =>
      existingDetails.billingAccountId.nonEmpty.otherwise("existing billing account id missing")
    case AmazonPayPaymentFields(amazonPayBillingAgreementId) =>
      amazonPayBillingAgreementId.nonEmpty.otherwise("amazonPayBillingAgreementId missing")
    case SepaPaymentFields(accountHolderName, iban, country, streetName) =>
      accountHolderName.nonEmpty.otherwise("sepa account holder name missing") and
        iban.nonEmpty.otherwise("sepa iban empty")
  }

}

object AddressAndCurrencyValidationRules {

  def deliveredToUkAndPaidInGbp(countryFromRequest: Country, currencyFromRequest: Currency): Result =
    (countryFromRequest == Country.UK).otherwise(s"should be delivered to UK, was $countryFromRequest") and
      (currencyFromRequest == GBP).otherwise(s"should be paid for in GBP, was $currencyFromRequest")

  def hasAddressLine1AndCity(address: Address): Result = {
    address.lineOne.isDefined.otherwise("must have address line 1") and
      address.city.isDefined.otherwise("must have a city")
  }

  def hasStateIfRequired(countryFromRequest: Country, stateFromRequest: Option[String]): Result =
    if (
      countryFromRequest == Country.US || countryFromRequest == Country.Canada || countryFromRequest == Country.Australia
    ) {
      stateFromRequest match {
        case None =>
          Invalid(s"state is required for $countryFromRequest")
        case Some("") =>
          Invalid(s"state is required for $countryFromRequest")
        case _ => Valid
      }
    } else Valid

  //     hasValidPostcodeLength checks if the length of postCodeIsShortEnoughForSalesforce(must be less than or equal to 20 characters)
  def hasValidPostcodeLength(postcodeFromRequest: Option[String], addressType: String): Result = {
    val validPostCode = postcodeFromRequest match {
      case Some(postCode) if postCode.length > 20 =>
        Invalid(s"$addressType PostCode length must not be greater than 20 characters")
      case _ => Valid
    }
    validPostCode
  }

  def hasPostcodeIfRequired(countryFromRequest: Country, postcodeFromRequest: Option[String]): Result =
    if (
      countryFromRequest == Country.UK ||
      countryFromRequest == Country.US ||
      countryFromRequest == Country.Canada ||
      countryFromRequest == Country.Australia
    ) {
      postcodeFromRequest.isDefined.otherwise(s"postcode is required for $countryFromRequest")
    } else Valid

  def currencyIsSupportedForCountry(countryFromRequest: Country, currencyFromRequest: Currency): Result = {
    val countryGroupsForCurrency = CountryGroup.allGroups.filter(_.currency == currencyFromRequest)
    val isValid = countryGroupsForCurrency.flatMap(_.countries).contains(countryFromRequest)

    val validCurrenciesForCountry =
      CountryGroup.allGroups.filter(_.countries.contains(countryFromRequest)).flatMap { countryGroup =>
        countryGroup.currency :: countryGroup.additionalCurrencies
      }
    isValid.otherwise(
      s"currency $currencyFromRequest is not supported for country $countryFromRequest, can only have $validCurrenciesForCountry",
    )
  }

}
object DigitalPackValidation {

  import AddressAndCurrencyValidationRules._

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest, digitalPack: DigitalPack): Result = {
    import createSupportWorkersRequest._
    import createSupportWorkersRequest.billingAddress._
    import createSupportWorkersRequest.product._

    def isValidRedemption =
      SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) and
        hasStateIfRequired(country, state)

    def isValidPaidSub(paymentFields: PaymentFields) =
      SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) and
        hasStateIfRequired(country, state) and
        // Lines removed to facilitate purchase of digi subs via the S+ checkout
        // hasAddressLine1AndCity(billingAddress) and
        // hasPostcodeIfRequired(country, postCode) and
        // hasValidPostcodeLength(postCode, "Billing") and
        currencyIsSupportedForCountry(country, currency) and
        PaidProductValidation.noEmptyPaymentFields(paymentFields)

    def isValidBenefitsTestSub = {
      if (
        isValidBenefitsTestPurchase(
          digitalPack,
          Some(supportAbTests),
        )
      ) Valid
      else
        Invalid("User is not in the benefits test")
    }

    val Purchase = Left
    type Redemption[A, B] = Right[A, B]

    (paymentFields, digitalPack.readerType, createSupportWorkersRequest.giftRecipient) match {
      case (Purchase(paymentFields), ReaderType.Direct, None) =>
        isValidBenefitsTestSub or isValidPaidSub(paymentFields)
      case (Purchase(paymentFields), ReaderType.Gift, Some(GiftRecipientRequest(_, _, _, Some(_), _, _))) =>
        isValidPaidSub(paymentFields)
      case (_: Redemption[_, _], ReaderType.Gift, None) =>
        SimpleCheckoutFormValidation.passes(createSupportWorkersRequest)
      case _ =>
        Invalid(
          s"invalid digital subscription request: paymentFields: $paymentFields, readerType: $digitalPack.readerType, giftRecipient: $giftRecipient",
        )
    }
  }
}

object GuardianWeeklyValidation {

  import AddressAndCurrencyValidationRules._

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest): Result =
    createSupportWorkersRequest.deliveryAddress match {
      case Some(address) =>
        PaidProductValidation.passes(createSupportWorkersRequest) and
          createSupportWorkersRequest.firstDeliveryDate.nonEmpty.otherwise("first delivery date is required") and
          hasAddressLine1AndCity(createSupportWorkersRequest.billingAddress) and
          hasAddressLine1AndCity(address) and
          hasValidPostcodeLength(address.postCode, "Delivery") and hasValidPostcodeLength(
            createSupportWorkersRequest.billingAddress.postCode,
            "Billing",
          )
      case None => Invalid("missing delivery address")
    }

}

object PaperValidation extends SafeLogging {

  import AddressAndCurrencyValidationRules._

  def passes(createSupportWorkersRequest: CreateSupportWorkersRequest, fulfilmentOptions: FulfilmentOptions): Result = {

    val maybeValid: Either[Result, Result] = for {
      address <- createSupportWorkersRequest.deliveryAddress.toRight(Invalid("missing delivery address"))
      postCode <- address.postCode.toRight(Invalid("missing post code"))
    } yield {

      val hasDeliveryAddressInUKAndPaidInGbp =
        deliveredToUkAndPaidInGbp(address.country, createSupportWorkersRequest.product.currency)
      val deliveryAddressHasAddressLine1AndCity = hasAddressLine1AndCity(address)
      val validPostcode = fulfilmentOptions match {
        case NationalDelivery => Valid // checked separately
        case HomeDelivery => postcodeIsWithinHomeDeliveryArea(postCode)
        case Collection => Valid
        case Domestic => Invalid("domestic is not valid for paper")
        case RestOfWorld => Invalid("rest of world is not valid for paper")
        case NoFulfilmentOptions => Invalid("no fulfilment options is not valid for paper")
      }

      PaidProductValidation.passes(createSupportWorkersRequest) and
        hasDeliveryAddressInUKAndPaidInGbp and
        createSupportWorkersRequest.firstDeliveryDate.nonEmpty.otherwise("first delivery date is missing") and
        hasAddressLine1AndCity(createSupportWorkersRequest.billingAddress) and
        deliveryAddressHasAddressLine1AndCity and
        validPostcode and hasValidPostcodeLength(address.postCode, "Delivery") and hasValidPostcodeLength(
          createSupportWorkersRequest.billingAddress.postCode,
          "Billing",
        )

    }

    maybeValid.merge // since we have Either[Result, Result] we can .merge it into a Result

  }

  def getPrefix(postcode: String): String = {

    val formattedPostcode = postcode.replaceAll(" ", "").toUpperCase
    formattedPostcode.slice(0, formattedPostcode.length - 3)

  }

  def deliveryAgentChosenWhichCoversPostcode(
      paperRound: PaperRoundAPI,
      deliveryAgent: Option[AgentId],
      postcode: String,
  )(implicit
      ex: ExecutionContext,
  ): Future[Result] = deliveryAgent match {
    case None => Future.successful(Invalid(s"User has not chosen a delivery agent"))
    case Some(agent) =>
      paperRound
        .coverage(RequestBody(postcode))
        .map(response =>
          response.data.status match {
            case CO if response.data.agents.map(_.agentId).contains(agent) => Valid
            case _ =>
              logger.error(
                scrub"User’s postcode $postcode wasn’t covered by their chosen delivery agent $agent: PaperRound response was $response",
              )
              Invalid(
                s"User’s postcode $postcode wasn’t covered by their chosen delivery agent $agent",
              )
          },
        )
  }

  def postcodeIsWithinHomeDeliveryArea(postcode: String): Result =
    M25_POSTCODE_PREFIXES.contains(getPrefix(postcode)).otherwise(s"postcode $postcode is not within M25")

  val M25_POSTCODE_PREFIXES = List(
    "BR1",
    "BR2",
    "BR3",
    "BR4",
    "BR5",
    "BR6",
    "BR7",
    "BR8",
    "CR0",
    "CR2",
    "CR3",
    "CR4",
    "CR5",
    "CR6",
    "CR7",
    "CR8",
    "DA1",
    "DA14",
    "DA15",
    "DA16",
    "DA5",
    "DA7",
    "DA8",
    "DA17",
    "E1",
    "E10",
    "E11",
    "E12",
    "E13",
    "E14",
    "E15",
    "E16",
    "E17",
    "E18",
    "E1W",
    "E2",
    "E3",
    "E4",
    "E5",
    "E6",
    "E7",
    "E8",
    "E9",
    "EC1A",
    "EC1R",
    "EC1V",
    "EC1Y",
    "EC2A",
    "EC2Y",
    "EC4A",
    "EN1",
    "EN2",
    "EN3",
    "EN4",
    "EN5",
    "GU1",
    "GU2",
    "GU22",
    "HA0",
    "HA1",
    "HA2",
    "HA3",
    "HA4",
    "HA5",
    "HA6",
    "HA7",
    "HA8",
    "HA9",
    "IG1",
    "IG10",
    "IG11",
    "IG2",
    "IG3",
    "IG4",
    "IG5",
    "IG6",
    "IG7",
    "IG8",
    "IG9",
    "KT1",
    "KT10",
    "KT11",
    "KT12",
    "KT13",
    "KT14",
    "KT15",
    "KT16",
    "KT17",
    "KT18",
    "KT19",
    "KT2",
    "KT20",
    "KT21",
    "KT3",
    "KT4",
    "KT5",
    "KT6",
    "KT7",
    "KT8",
    "KT9",
    "N1",
    "N10",
    "N11",
    "N12",
    "N13",
    "N14",
    "N15",
    "N16",
    "N17",
    "N18",
    "N19",
    "N2",
    "N20",
    "N21",
    "N22",
    "N3",
    "N4",
    "N5",
    "N6",
    "N7",
    "N8",
    "N9",
    "NW1",
    "NW10",
    "NW11",
    "NW2",
    "NW3",
    "NW4",
    "NW5",
    "NW6",
    "NW7",
    "NW8",
    "NW9",
    "RM1",
    "RM11",
    "RM12",
    "RM14",
    "RM2",
    "RM3",
    "RM5",
    "RM6",
    "RM7",
    "RM8",
    "SE1",
    "SE10",
    "SE11",
    "SE12",
    "SE13",
    "SE14",
    "SE15",
    "SE16",
    "SE17",
    "SE18",
    "SE19",
    "SE2",
    "SE20",
    "SE21",
    "SE22",
    "SE23",
    "SE24",
    "SE25",
    "SE26",
    "SE27",
    "SE28",
    "SE3",
    "SE4",
    "SE5",
    "SE6",
    "SE7",
    "SE8",
    "SE9",
    "SM1",
    "SM2",
    "SM3",
    "SM4",
    "SM5",
    "SM6",
    "SM7",
    "SW10",
    "SW11",
    "SW12",
    "SW13",
    "SW14",
    "SW15",
    "SW16",
    "SW17",
    "SW18",
    "SW19",
    "SW1A",
    "SW1E",
    "SW1H",
    "SW1P",
    "SW1V",
    "SW1W",
    "SW1X",
    "SW1Y",
    "SW2",
    "SW20",
    "SW3",
    "SW4",
    "SW5",
    "SW6",
    "SW7",
    "SW8",
    "SW9",
    "TW1",
    "TW10",
    "TW11",
    "TW12",
    "TW13",
    "TW14",
    "TW15",
    "TW16",
    "TW17",
    "TW18",
    "TW2",
    "TW3",
    "TW4",
    "TW5",
    "TW7",
    "TW8",
    "TW9",
    "UB1",
    "UB10",
    "UB2",
    "UB5",
    "UB6",
    "UB7",
    "UB8",
    "UB9",
    "W10",
    "W11",
    "W12",
    "W13",
    "W14",
    "W1D",
    "W1G",
    "W1H",
    "W1K",
    "W1T",
    "W1U",
    "W2",
    "W3",
    "W4",
    "W5",
    "W6",
    "W7",
    "W8",
    "W9",
    "WC1E",
    "WC1H",
    "WC1N",
    "WC1R",
    "WC1X",
    "WC2E",
    "WD17",
    "WD18",
    "WD19",
    "WD23",
    "WD24",
    "WD25",
    "WD3",
    "WD5",
    "WD6",
    "WD7",
    "TN16",
  )

}
