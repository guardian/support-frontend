package admin.settings

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import io.circe.parser.decode

class SwitchesSpec extends AnyWordSpec with Matchers {
  "Switches" should {
    "decode json" in {
      val json =
        """
          |{
          |  "oneOffPaymentMethods" : {
          |    "description" : "Payment methods - one-off contributions",
          |    "switches" : {
          |      "stripe" : {
          |        "description" : "Stripe - Credit/Debit card",
          |        "state" : "On"
          |      },
          |      "stripeApplePay" : {
          |        "description" : "Stripe - Apple Pay",
          |        "state" : "On"
          |      },
          |      "stripePaymentRequestButton" : {
          |        "description" : "Stripe - Payment Request Button",
          |        "state" : "On"
          |      },
          |      "payPal" : {
          |        "description" : "PayPal",
          |        "state" : "On"
          |      },
          |      "amazonPay" : {
          |        "description" : "Amazon Pay",
          |        "state" : "On"
          |      }
          |    }
          |  },
          |  "recurringPaymentMethods" : {
          |    "description" : "Payment methods - recurring contributions",
          |    "switches" : {
          |      "stripe" : {
          |        "description" : "Stripe - Credit/Debit card",
          |        "state" : "On"
          |      },
          |      "stripeApplePay" : {
          |        "description" : "Stripe - Apple Pay",
          |        "state" : "On"
          |      },
          |      "stripePaymentRequestButton" : {
          |        "description" : "Stripe - Payment Request Button",
          |        "state" : "On"
          |      },
          |      "payPal" : {
          |        "description" : "PayPal",
          |        "state" : "On"
          |      },
          |      "amazonPay" : {
          |        "description" : "Amazon Pay",
          |        "state" : "Off"
          |      },
          |      "directDebit" : {
          |        "description" : "Direct Debit",
          |        "state" : "On"
          |      },
          |      "existingCard" : {
          |        "description" : "Existing card",
          |        "state" : "On"
          |      },
          |      "existingDirectDebit" : {
          |        "description" : "Existing Direct Debit",
          |        "state" : "On"
          |      },
          |      "sepa" : {
          |        "description" : "SEPA",
          |        "state" : "Off"
          |      }
          |    }
          |  },
          |  "subscriptionsSwitches": {
          |    "description": "Subscriptions",
          |    "switches": {
          |      "checkoutPostcodeLookup" : {
          |        "description" : "Enable external service postcode lookup in checkout form",
          |        "state" : "On"
          |      },
          |      "enableDigitalSubGifting" : {
          |        "description" : "Enable Digital Sub gifting",
          |        "state" : "On"
          |      },
          |      "useDotcomContactPage" : {
          |        "description" : "Use Dotcom contact page",
          |        "state" : "On"
          |      }
          |    }
          |  },
          |  "featureSwitches" : {
          |    "description" : "Feature switches",
          |    "switches" : {
          |      "enableQuantumMetric" : {
          |        "description" : "Enable quantum metric",
          |        "state" : "On"
          |      },
          |      "usStripeAccountForSingle" : {
          |        "description" : "US Stripe account for single contributions",
          |        "state" : "On"
          |      }
          |    }
          |  },
          |  "campaignSwitches" : {
          |    "description" : "Campaign switches",
          |    "switches" : {
          |      "enableContributionsCampaign" : {
          |        "description" : "Enable contributions campaign",
          |        "state" : "Off"
          |      },
          |      "forceContributionsCampaign" : {
          |        "description" : "Force all users into the contributions campaign (ignore url path)",
          |        "state" : "Off"
          |      }
          |    }
          |  },
          |  "recaptchaSwitches": {
          |    "description" : "Recaptcha switches",
          |    "switches" : {
          |      "enableRecaptchaBackend" : {
          |        "description" : "Enable Recaptcha on the backend",
          |        "state" : "On"
          |      },
          |      "enableRecaptchaFrontend" : {
          |        "description" : "Enable Recaptcha on the client",
          |        "state" : "On"
          |      }
          |    }
          |  }
          |}
          |""".stripMargin

      decode[Switches](json) mustBe (Right(
        Switches(
          oneOffPaymentMethods = OneOffPaymentMethodSwitches(On,On,On,On,On),
          recurringPaymentMethods = RecurringPaymentMethodSwitches(On,On,On,On,On,On,On,Off,Off),
          subscriptionsSwitches = SubscriptionsSwitches(On,On,On),
          featureSwitches = FeatureSwitches(On, On),
          campaignSwitches = CampaignSwitches(Off, Off),
          recaptchaSwitches = RecaptchaSwitches(On, On)
        )
      ))
    }
  }
}
