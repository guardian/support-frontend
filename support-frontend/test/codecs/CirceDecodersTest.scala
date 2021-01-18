package codecs

import admin._
import admin.settings.SwitchState.{Off, On}
import admin.settings._
import cats.syntax.either._
import codecs.CirceDecoders._
import config.Configuration.MetricUrl
import io.circe.Json
import io.circe.parser.{parse, _}
import io.circe.syntax._
import models.CheckBankAccountDetails
import ophan.thrift.event.AbTest
import org.scalatest.EitherValues._
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.must.Matchers

class CirceDecodersTest extends AnyWordSpec with Matchers {

  "AbTestDecoder" should {
    "decode json" in {
      val json =
        """
          |{
          |  "name":"test_1",
          |  "variant":"variant_34"
          |}
        """
          .stripMargin

      val parsedJson = parse(json).toOption.get

      val abtest: AbTest = abTestDecoder.decodeJson(parsedJson).right.get

      abtest.name mustBe "test_1"
      abtest.variant mustBe "variant_34"
    }
  }

  "CheckBankAccountDecoder" should {
    "decode json" in {
      val json =
        """
          |{
          |   "sortCode": "121212",
          |   "accountNumber": "12121212"
          |}
        """.stripMargin

      val parsedJson = parse(json).toOption.get

      val checkBankAccountData: CheckBankAccountDetails = CheckBankAccountDetails.codec.decodeJson(parsedJson).right.get

      checkBankAccountData.sortCode.value mustBe "121212"
      checkBankAccountData.accountNumber.value mustBe "12121212"
    }
  }

  "SwitchStateDecoder" should {
    "decode json" in {
      decode[SwitchState]("\"On\"").right.value mustBe On
      decode[SwitchState]("\"Off\"").right.value mustBe Off
    }

  }
  "SwitchStateEncoder" should {
    "encode json" in {
      val on: SwitchState = On
      on.asJson mustBe Json.fromString("On")

      val off: SwitchState = Off
      off.asJson mustBe Json.fromString("Off")
    }
  }

  "SegmentDecoder" should {
    "decode json" in {
      decode[Segment]("\"Perc0\"").right.value mustBe Segment.Perc0
      decode[Segment]("\"Perc50\"").right.value mustBe Segment.Perc50
      decode[Segment]("\"Anything else\"").right.value mustBe Segment.Perc50
    }
  }

  "SegmentEncoder" should {
    "encode json" in {
      val perc0: Segment = Segment.Perc0
      perc0.asJson mustBe Json.fromString("Perc0")

      val perc50: Segment = Segment.Perc50
      perc50.asJson mustBe Json.fromString("Perc50")
    }
  }

  "SettingsDecoder" should {
    "decode json" in {
      val json =
        """{
          |  "switches": {
          |    "oneOffPaymentMethods": {
          |      "stripe": "On",
          |      "stripeApplePay": "On",
          |      "stripePaymentRequestButton": "On",
          |      "payPal": "On",
          |      "amazonPay": "On"
          |    },
          |    "recurringPaymentMethods": {
          |      "stripe": "On",
          |      "stripeApplePay": "On",
          |      "stripePaymentRequestButton": "Off",
          |      "payPal": "On",
          |      "directDebit": "On",
          |      "existingCard": "On",
          |      "existingDirectDebit": "On"
          |    },
          |    "experiments": {
          |      "newFlow": {
          |        "name": "newFlow",
          |        "description": "Redesign of the payment flow UI",
          |        "state": "On"
          |      }
          |    },
          |    "enableDigitalSubGifting": "On",
          |    "useDotcomContactPage": "Off",
          |    "enableRecaptchaFrontend": "Off",
          |    "enableRecaptchaBackend": "Off",
          |    "enableContributionsCampaign": "On",
          |    "forceContributionsCampaign": "On"
          |  },
          |  "amounts": {
          |    "GBPCountries": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    },
          |    "UnitedStates": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    },
          |    "EURCountries": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    },
          |    "AUDCountries": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    },
          |    "International": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    },
          |    "NZDCountries": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    },
          |    "Canada": {
          |      "control": {
          |         "ONE_OFF": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "MONTHLY": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         },
          |         "ANNUAL": {
          |             "amounts": [25],
          |             "defaultAmount": 25
          |         }
          |      }
          |    }
          |  },
          |  "contributionTypes": {
          |       "GBPCountries": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ],
          |       "UnitedStates": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ],
          |       "EURCountries": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ],
          |       "International": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ],
          |       "Canada": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ],
          |       "AUDCountries": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ],
          |       "NZDCountries": [
          |           { "contributionType": "ONE_OFF", "isDefault": true }
          |       ]
          |  },
          |  "metricUrl": "http://localhost"
          |}""".stripMargin

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

      val settings = AllSettings(
        Switches(
          oneOffPaymentMethods = PaymentMethodsSwitch(
            stripe = On,
            stripeApplePay = On,
            stripePaymentRequestButton = On,
            payPal = On,
            directDebit = None,
            existingCard = None,
            existingDirectDebit = None,
            amazonPay = Some(On)
          ),
          recurringPaymentMethods = PaymentMethodsSwitch(
            stripe = On,
            stripeApplePay = On,
            stripePaymentRequestButton = Off,
            payPal = On,
            directDebit = Some(On),
            existingCard = Some(On),
            existingDirectDebit = Some(On),
            amazonPay = None
          ),
          experiments = Map(
            "newFlow" -> ExperimentSwitch(
              name = "newFlow",
              description = "Redesign of the payment flow UI",
              state = On
            )
          ),
          enableDigitalSubGifting = On,
          useDotcomContactPage = Some(Off),
          enableRecaptchaBackend = Off,
          enableRecaptchaFrontend = Off,
          enableContributionsCampaign = On,
          forceContributionsCampaign = On
        ),
        configuredAmounts,
        contributionTypes,
        metricUrl = MetricUrl("http://localhost")
      )

      decode[AllSettings](json).right.value mustBe settings
    }
  }
}

