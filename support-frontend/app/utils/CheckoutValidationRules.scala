package utils

import admin.settings.{On, RecurringPaymentMethodSwitches, SubscriptionsPaymentMethodSwitches, Switches}
import com.gu.i18n.Currency.GBP
import com.gu.i18n.{Country, CountryGroup, Currency}
import com.gu.monitoring.SafeLogging
import com.gu.support.catalog._
import com.gu.support.paperround.CoverageEndpoint.{CO, RequestBody}
import com.gu.support.paperround.{AgentId, PaperRoundAPI}
import com.gu.support.workers._
import services.stepfunctions.CreateSupportWorkersRequest
import utils.CheckoutValidationRules._

import scala.concurrent.{ExecutionContext, Future}

object PreservableErrorMessages {
  val invalidCharactersInBillingPostcodeError = "invalid_characters_in_billing_postcode"

  val preservableErrorMessages = Set(
    invalidCharactersInBillingPostcodeError,
  )

  def isMessagePreservable(message: String): Boolean = preservableErrorMessages.contains(message)
}

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
      paymentFields: PaymentFields,
  ) = paymentFields match {
    case _: PayPalPaymentFields =>
      if (switches.paypal.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _: DirectDebitPaymentFields =>
      if (switches.directDebit.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _: StripePaymentFields =>
      if (switches.creditCard.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _: StripeHostedPaymentFields =>
      if (switches.stripeHostedCheckout.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _ => Invalid("Invalid Payment Method")
  }

  def checkContributionPaymentMethodEnabled(
      switches: RecurringPaymentMethodSwitches,
      paymentFields: PaymentFields,
  ) = paymentFields match {
    case _: PayPalPaymentFields =>
      if (switches.payPal.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _: PayPalCompletePaymentsPaymentFields => Valid // TODO: add switch
    case _: DirectDebitPaymentFields =>
      if (switches.directDebit.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _: SepaPaymentFields =>
      if (switches.sepa.contains(On)) Valid else Invalid("Invalid Payment Method")
    case _: StripeHostedPaymentFields =>
      if (switches.stripeHostedCheckout.contains(On)) Valid else Invalid("Invalid Payment Method")
    case s: StripePaymentFields =>
      s.stripePaymentType match {
        case Some(StripePaymentType.StripeApplePay) =>
          if (switches.stripeApplePay.contains(On)) Valid else Invalid("Invalid Payment Method")
        case Some(StripePaymentType.StripePaymentRequestButton) =>
          if (switches.stripePaymentRequestButton.contains(On)) Valid else Invalid("Invalid Payment Method")
        case Some(StripePaymentType.StripeCheckout) =>
          if (switches.stripe.contains(On)) Valid else Invalid("Invalid Payment Method")
        case None => Invalid("Invalid Payment Method")
      }
  }
  def checkPaymentMethodEnabled(
      product: ProductType,
      paymentFields: PaymentFields,
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
      case _: GuardianAdLite => PaidProductValidation.passes(createSupportWorkersRequest)
    }) match {
      case Invalid(message) if PreservableErrorMessages.isMessagePreservable(message) => Invalid(message)
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
      noEmptyPaymentFields(createSupportWorkersRequest.paymentFields) and
      hasStateIfRequired(
        createSupportWorkersRequest.billingAddress.country,
        createSupportWorkersRequest.billingAddress.state,
      ) and
      // For products which use this validation, we only collect postal/zip code in the US
      hasValidBillingPostcodeCharacters(createSupportWorkersRequest.billingAddress.postCode)

  def noEmptyPaymentFields(paymentFields: PaymentFields): Result = paymentFields match {
    case directDebitDetails: DirectDebitPaymentFields =>
      directDebitDetails.accountHolderName.nonEmpty.otherwise("DD account name missing") and
        directDebitDetails.accountNumber.nonEmpty.otherwise("DD account number missing") and
        directDebitDetails.sortCode.nonEmpty.otherwise("DD sort code missing")
    case _: StripePaymentFields => Valid // already validated in PaymentMethodId.apply
    case payPalDetails: PayPalPaymentFields => payPalDetails.baid.nonEmpty.otherwise("paypal BAID missing")
    case SepaPaymentFields(accountHolderName, iban, country, streetName) =>
      accountHolderName.nonEmpty.otherwise("sepa account holder name missing") and
        iban.nonEmpty.otherwise("sepa iban empty")
    case _: StripeHostedPaymentFields => Valid
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

  def hasValidBillingPostcodeCharacters(postcodeFromRequest: Option[String]): Result =
    postcodeFromRequest match {
      case Some(postCode) if postCode.contains("@") =>
        Invalid(PreservableErrorMessages.invalidCharactersInBillingPostcodeError)
      case _ => Valid
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

    def isValidPaidSub(paymentFields: PaymentFields) =
      SimpleCheckoutFormValidation.passes(createSupportWorkersRequest) and
        hasStateIfRequired(country, state) and
        // Lines removed to facilitate purchase of digi subs via the S+ checkout
        // hasAddressLine1AndCity(billingAddress) and
        // hasPostcodeIfRequired(country, postCode) and
        // hasValidPostcodeLength(postCode, "Billing") and
        currencyIsSupportedForCountry(country, currency) and
        PaidProductValidation.noEmptyPaymentFields(paymentFields)

    isValidPaidSub(paymentFields)
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

  val M25_POSTCODE_OLD_PREFIXES = List(
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
    "CR9",
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
    "E20",
    "E1W",
    "E2",
    "E3",
    "E4",
    "E5",
    "E6",
    "E7",
    "E8",
    "E9",
    "E98",
    "EC1A",
    "EC1M",
    "EC1N",
    "EC1R",
    "EC1V",
    "EC1Y",
    "EC2A",
    "EC2M",
    "EC2N",
    "EC2R",
    "EC2V",
    "EC2Y",
    "EC3A",
    "EC3M",
    "EC3N",
    "EC3P",
    "EC3R",
    "EC3V",
    "EC4A",
    "EC4M",
    "EC4N",
    "EC4P",
    "EC4R",
    "EC4V",
    "EC4Y",
    "EN1",
    "EN2",
    "EN3",
    "EN4",
    "EN5",
    "GU1",
    "GU2",
    "GU21",
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
    "N1C",
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
    "RM10",
    "RM11",
    "RM12",
    "RM13",
    "RM14",
    "RM2",
    "RM3",
    "RM4",
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
    "SW1",
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
    "TW19",
    "TW2",
    "TW20",
    "TW3",
    "TW4",
    "TW5",
    "TW6",
    "TW7",
    "TW8",
    "TW9",
    "UB1",
    "UB10",
    "UB11",
    "UB2",
    "UB3",
    "UB4",
    "UB5",
    "UB6",
    "UB7",
    "UB8",
    "UB9",
    "W1",
    "W10",
    "W11",
    "W12",
    "W13",
    "W14",
    "W1A",
    "W1B",
    "W1C",
    "W1D",
    "W1F",
    "W1G",
    "W1H",
    "W1J",
    "W1K",
    "W1M",
    "W1N",
    "W1P",
    "W1R",
    "W1S",
    "W1T",
    "W1U",
    "W1V",
    "W1W",
    "W1X",
    "W1Y",
    "W2",
    "W3",
    "W4",
    "W5",
    "W6",
    "W7",
    "W8",
    "W9",
    "WC1",
    "WC1A",
    "WC1B",
    "WC1E",
    "WC1H",
    "WC1N",
    "WC1R",
    "WC1V",
    "WC1X",
    "WC2",
    "WC2A",
    "WC2B",
    "WC2E",
    "WC2H",
    "WC2N",
    "WC2R",
    "WD1",
    "WD17",
    "WD18",
    "WD19",
    "WD23",
    "WD24",
    "WD25",
    "WD3",
    "WD4",
    "WD5",
    "WD6",
    "WD7",
    "TN16",
  )

  val M25_NEW_PREFIXES = List(
    "AL2",
    "BR12",
    "BR13",
    "BR14",
    "BR15",
    "BR20",
    "BR26",
    "BR27",
    "BR28",
    "BR29",
    "BR31",
    "BR33",
    "BR34",
    "BR35",
    "BR36",
    "BR40",
    "BR49",
    "BR51",
    "BR52",
    "BR53",
    "BR54",
    "BR60",
    "BR66",
    "BR67",
    "BR68",
    "BR69",
    "BR75",
    "BR76",
    "CR00",
    "CR01",
    "CR02",
    "CR03",
    "CR04",
    "CR05",
    "CR06",
    "CR07",
    "CR08",
    "CR09",
    "CR02N",
    "CR20",
    "CR26",
    "CR27",
    "CR28",
    "CR29",
    "CR35",
    "CR36",
    "CR41",
    "CR42",
    "CR43",
    "CR44",
    "CR51",
    "CR69",
    "CR76",
    "CR77",
    "CR78",
    "CR81",
    "CR82",
    "CR83",
    "CR84",
    "CR85",
    "DA15",
    "DA144",
    "DA146",
    "DA157",
    "DA158",
    "DA161",
    "DA162",
    "DA176",
    "DA51",
    "DA52",
    "DA53",
    "DA76",
    "DA81",
    "DA83",
    "E10",
    "E12",
    "E13",
    "E14",
    "E15",
    "E16",
    "E18",
    "E105",
    "E106",
    "E107",
    "E111",
    "E112",
    "E113",
    "E114",
    "E125",
    "E126",
    "E130",
    "E142",
    "E143",
    "E144",
    "E145",
    "E146",
    "E147",
    "E148",
    "E149",
    "E151",
    "E153",
    "E154",
    "E161",
    "E162",
    "E163",
    "E164",
    "E173",
    "E174",
    "E175",
    "E176",
    "E177",
    "E178",
    "E179",
    "E181",
    "E182",
    "E1W1",
    "E1W2",
    "E1W3",
    "E20",
    "E26",
    "E27",
    "E28",
    "E29",
    "E201",
    "E32",
    "E33",
    "E34",
    "E35",
    "E46",
    "E47",
    "E48",
    "E49",
    "E50",
    "E58",
    "E59",
    "E61",
    "E62",
    "E63",
    "E65",
    "E66",
    "E70",
    "E78",
    "E79",
    "E81",
    "E82",
    "E83",
    "E84",
    "E95",
    "E96",
    "E97",
    "E981",
    "EN8",
    "EN11",
    "EN12",
    "EN13",
    "EN14",
    "EN20",
    "EN26",
    "EN27",
    "EN28",
    "EN29",
    "EN34",
    "EN35",
    "EN36",
    "EN37",
    "EN40",
    "EN48",
    "EN49",
    "EN51",
    "EN52",
    "EN53",
    "EN54",
    "EN55",
    "EN88",
    "HA02",
    "HA03",
    "HA04",
    "HA11",
    "HA12",
    "HA13",
    "HA14",
    "HA20",
    "HA26",
    "HA27",
    "HA28",
    "HA29",
    "HA30",
    "HA35",
    "HA36",
    "HA37",
    "HA38",
    "HA39",
    "HA40",
    "HA46",
    "HA47",
    "HA48",
    "HA49",
    "HA51",
    "HA52",
    "HA53",
    "HA54",
    "HA55",
    "HA61",
    "HA62",
    "HA63",
    "HA71",
    "HA72",
    "HA73",
    "HA74",
    "HA80",
    "HA85",
    "HA86",
    "HA87",
    "HA88",
    "HA89",
    "HA96",
    "HA97",
    "HA98",
    "HA99",
    "IG4",
    "IG11",
    "IG12",
    "IG13",
    "IG14",
    "IG101",
    "IG102",
    "IG103",
    "IG104",
    "IG118",
    "IG119",
    "IG26",
    "IG27",
    "IG38",
    "IG39",
    "IG45",
    "IG50",
    "IG61",
    "IG62",
    "IG75",
    "IG76",
    "IG80",
    "IG87",
    "IG88",
    "IG89",
    "IG95",
    "IG96",
    "KT11",
    "KT12",
    "KT13",
    "KT14",
    "KT22",
    "KT100",
    "KT108",
    "KT109",
    "KT111",
    "KT112",
    "KT113",
    "KT121",
    "KT122",
    "KT123",
    "KT124",
    "KT125",
    "KT130",
    "KT138",
    "KT139",
    "KT146",
    "KT147",
    "KT151",
    "KT152",
    "KT153",
    "KT168",
    "KT169",
    "KT171",
    "KT172",
    "KT173",
    "KT174",
    "KT185",
    "KT186",
    "KT187",
    "KT190",
    "KT197",
    "KT198",
    "KT199",
    "KT25",
    "KT26",
    "KT27",
    "KT206",
    "KT211",
    "KT212",
    "KT220",
    "KT228",
    "KT229",
    "KT33",
    "KT34",
    "KT35",
    "KT36",
    "KT47",
    "KT48",
    "KT58",
    "KT59",
    "KT64",
    "KT65",
    "KT66",
    "KT67",
    "KT70",
    "KT80",
    "KT81",
    "KT82",
    "KT89",
    "KT91",
    "KT92",
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
    "N101",
    "N102",
    "N103",
    "N111",
    "N112",
    "N113",
    "N120",
    "N127",
    "N128",
    "N129",
    "N134",
    "N135",
    "N136",
    "N144",
    "N145",
    "N146",
    "N147",
    "N153",
    "N154",
    "N155",
    "N156",
    "N160",
    "N165",
    "N166",
    "N167",
    "N168",
    "N169",
    "N170",
    "N176",
    "N177",
    "N178",
    "N179",
    "N181",
    "N193",
    "N194",
    "N195",
    "N1C4",
    "N20",
    "N28",
    "N29",
    "N200",
    "N208",
    "N209",
    "N211",
    "N212",
    "N213",
    "N225",
    "N226",
    "N227",
    "N228",
    "N31",
    "N32",
    "N33",
    "N41",
    "N42",
    "N43",
    "N44",
    "N51",
    "N52",
    "N64",
    "N65",
    "N66",
    "N70",
    "N76",
    "N77",
    "N78",
    "N79",
    "N80",
    "N87",
    "N88",
    "N89",
    "N90",
    "N97",
    "N98",
    "N99",
    "W10",
    "NW11",
    "NW12",
    "NW13",
    "NW14",
    "NW15",
    "NW16",
    "NW17",
    "NW18",
    "NW19",
    "NW100",
    "NW101",
    "NW102",
    "NW103",
    "NW104",
    "NW105",
    "NW107",
    "NW108",
    "NW109",
    "NW110",
    "NW116",
    "NW117",
    "NW118",
    "NW119",
    "NW21",
    "NW22",
    "NW23",
    "NW24",
    "NW25",
    "NW26",
    "NW27",
    "NW31",
    "NW32",
    "NW33",
    "NW34",
    "NW35",
    "NW36",
    "NW37",
    "NW41",
    "NW42",
    "NW43",
    "NW44",
    "NW51",
    "NW52",
    "NW53",
    "NW54",
    "NW61",
    "NW62",
    "NW63",
    "NW64",
    "NW65",
    "NW66",
    "NW67",
    "NW71",
    "NW72",
    "NW73",
    "NW74",
    "NW80",
    "NW86",
    "NW87",
    "NW88",
    "NW89",
    "NW90",
    "NW94",
    "NW95",
    "NW96",
    "NW97",
    "NW98",
    "NW99",
    "RM111",
    "RM112",
    "RM126",
    "RM141",
    "RM143",
    "RM25",
    "RM30",
    "RM53",
    "RM64",
    "RM70",
    "RM77",
    "RM79",
    "RM82",
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
    "SE100",
    "SE108",
    "SE109",
    "SE114",
    "SE115",
    "SE116",
    "SE120",
    "SE128",
    "SE129",
    "SE135",
    "SE136",
    "SE137",
    "SE145",
    "SE146",
    "SE151",
    "SE152",
    "SE153",
    "SE154",
    "SE155",
    "SE156",
    "SE163",
    "SE164",
    "SE165",
    "SE166",
    "SE167",
    "SE171",
    "SE172",
    "SE173",
    "SE181",
    "SE182",
    "SE183",
    "SE184",
    "SE186",
    "SE187",
    "SE191",
    "SE192",
    "SE193",
    "SE20",
    "SE206",
    "SE207",
    "SE208",
    "SE217",
    "SE218",
    "SE220",
    "SE228",
    "SE229",
    "SE231",
    "SE232",
    "SE233",
    "SE240",
    "SE249",
    "SE254",
    "SE255",
    "SE256",
    "SE264",
    "SE265",
    "SE266",
    "SE270",
    "SE279",
    "SE280",
    "SE288",
    "SE30",
    "SE37",
    "SE38",
    "SE39",
    "SE41",
    "SE42",
    "SE50",
    "SE57",
    "SE58",
    "SE59",
    "SE61",
    "SE62",
    "SE63",
    "SE64",
    "SE77",
    "SE78",
    "SE83",
    "SE84",
    "SE85",
    "SE91",
    "SE92",
    "SE93",
    "SE94",
    "SE95",
    "SE96",
    "SM12",
    "SM13",
    "SM14",
    "SM25",
    "SM26",
    "SM27",
    "SM38",
    "SM39",
    "SM44",
    "SM45",
    "SM46",
    "SM51",
    "SM52",
    "SM53",
    "SM54",
    "SM60",
    "SM67",
    "SM68",
    "SM69",
    "SM71",
    "SM72",
    "SM73",
    "SW100",
    "SW109",
    "SW111",
    "SW112",
    "SW113",
    "SW114",
    "SW115",
    "SW116",
    "SW120",
    "SW128",
    "SW129",
    "SW130",
    "SW138",
    "SW139",
    "SW147",
    "SW148",
    "SW151",
    "SW152",
    "SW153",
    "SW154",
    "SW155",
    "SW156",
    "SW161",
    "SW162",
    "SW163",
    "SW164",
    "SW165",
    "SW166",
    "SW170",
    "SW176",
    "SW177",
    "SW178",
    "SW179",
    "SW181",
    "SW182",
    "SW183",
    "SW184",
    "SW185",
    "SW191",
    "SW192",
    "SW193",
    "SW194",
    "SW195",
    "SW196",
    "SW197",
    "SW198",
    "SW1A1",
    "SW1A2",
    "SW1E5",
    "SW1E6",
    "SW1H0",
    "SW1H9",
    "SW1P1",
    "SW1P2",
    "SW1P3",
    "SW1P4",
    "SW1V1",
    "SW1V2",
    "SW1V3",
    "SW1V4",
    "SW1W0",
    "SW1W1",
    "SW1W8",
    "SW1W9",
    "SW1X0",
    "SW1X7",
    "SW1X8",
    "SW1X9",
    "SW1Y4",
    "SW1Y5",
    "SW1Y6",
    "SW21",
    "SW22",
    "SW23",
    "SW24",
    "SW25",
    "SW200",
    "SW208",
    "SW209",
    "SW31",
    "SW32",
    "SW33",
    "SW34",
    "SW35",
    "SW36",
    "SW40",
    "SW46",
    "SW47",
    "SW48",
    "SW49",
    "SW50",
    "SW59",
    "SW61",
    "SW62",
    "SW63",
    "SW64",
    "SW65",
    "SW66",
    "SW67",
    "SW71",
    "SW72",
    "SW73",
    "SW74",
    "SW75",
    "SW81",
    "SW82",
    "SW83",
    "SW84",
    "SW85",
    "SW90",
    "SW96",
    "SW97",
    "SW98",
    "SW99",
    "TW11",
    "TW12",
    "TW13",
    "TW14",
    "TW105",
    "TW106",
    "TW107",
    "TW110",
    "TW118",
    "TW119",
    "TW121",
    "TW122",
    "TW123",
    "TW134",
    "TW135",
    "TW136",
    "TW137",
    "TW140",
    "TW148",
    "TW149",
    "TW151",
    "TW152",
    "TW153",
    "TW165",
    "TW166",
    "TW167",
    "TW170",
    "TW178",
    "TW179",
    "TW181",
    "TW182",
    "TW183",
    "TW184",
    "TW197",
    "TW25",
    "TW26",
    "TW27",
    "TW200",
    "TW208",
    "TW31",
    "TW32",
    "TW33",
    "TW34",
    "TW39",
    "TW45",
    "TW46",
    "TW47",
    "TW50",
    "TW59",
    "TW74",
    "TW75",
    "TW76",
    "TW77",
    "TW80",
    "TW88",
    "TW89",
    "TW91",
    "TW92",
    "TW93",
    "TW94",
    "UB11",
    "UB12",
    "UB13",
    "UB100",
    "UB108",
    "UB109",
    "UB111",
    "UB24",
    "UB25",
    "UB32",
    "UB34",
    "UB35",
    "UB40",
    "UB48",
    "UB49",
    "UB54",
    "UB55",
    "UB60",
    "UB68",
    "UB69",
    "UB77",
    "UB79",
    "UB81",
    "UB82",
    "UB83",
    "UB94",
    "UB95",
    "UB96",
    "W104",
    "W105",
    "W106",
    "W111",
    "W112",
    "W113",
    "W114",
    "W120",
    "W127",
    "W128",
    "W129",
    "W130",
    "W138",
    "W139",
    "W13O",
    "W140",
    "W148",
    "W149",
    "W1A3",
    "W1B1",
    "W1B3",
    "W1B4",
    "W1C2",
    "W1D3",
    "W1D4",
    "W1F0",
    "W1F7",
    "W1F8",
    "W1F9",
    "W1G0",
    "W1G6",
    "W1G7",
    "W1G8",
    "W1G9",
    "W1H1",
    "W1H2",
    "W1H5",
    "W1H6",
    "W1H7",
    "W1J0",
    "W1J5",
    "W1J6",
    "W1J7",
    "W1J8",
    "W1K1",
    "W1K2",
    "W1K3",
    "W1K4",
    "W1K5",
    "W1K6",
    "W1K7",
    "W1S1",
    "W1S2",
    "W1S3",
    "W1S4",
    "W1T1",
    "W1T2",
    "W1T4",
    "W1T6",
    "W1T7",
    "W1U1",
    "W1U2",
    "W1U3",
    "W1U4",
    "W1U5",
    "W1U6",
    "W1U7",
    "W1U8",
    "W1W5",
    "W1W6",
    "W1W7",
    "W1W8",
    "W21",
    "W22",
    "W23",
    "W24",
    "W25",
    "W26",
    "W30",
    "W36",
    "W37",
    "W38",
    "W39",
    "W41",
    "W42",
    "W43",
    "W44",
    "W45",
    "W51",
    "W52",
    "W53",
    "W54",
    "W55",
    "W60",
    "W67",
    "W68",
    "W69",
    "W71",
    "W72",
    "W73",
    "W84",
    "W85",
    "W86",
    "W87",
    "W91",
    "W92",
    "W93",
    "WC1B3",
    "WC1H0",
    "WC1H9",
    "WC1N1",
    "WC1N2",
    "WC1N3",
    "WC1R5",
    "WC1V6",
    "WC1V7",
    "WC1X0",
    "WC1X8",
    "WC1X9",
    "WC2A1",
    "WC2A3",
    "WC2E7",
    "WC2E8",
    "WC2E9",
    "WC2H9",
    "WC2N4",
    "WC2N5",
    "WC2N6",
    "WC2R0",
    "WC2R2",
    "WC2R3",
    "WD172",
    "WD173",
    "WD174",
    "WD180",
    "WD187",
    "WD188",
    "WD194",
    "WD195",
    "WD196",
    "WD197",
    "WD231",
    "WD232",
    "WD233",
    "WD234",
    "WD244",
    "WD245",
    "WD246",
    "WD247",
    "WD250",
    "WD257",
    "WD258",
    "WD259",
    "WD31",
    "WD33",
    "WD34",
    "WD35",
    "WD36",
    "WD37",
    "WD38",
    "WD48",
    "WD50",
    "WD61",
    "WD62",
    "WD63",
    "WD64",
    "WD65",
    "WD77",
    "WD78",
    "WD79",
  )

  val M25_POSTCODE_PREFIXES = M25_POSTCODE_OLD_PREFIXES ++ M25_NEW_PREFIXES

}
