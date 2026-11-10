package admin.settings

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import io.circe.parser.decode

class SwitchesSpec extends AnyWordSpec with Matchers {
  "FeatureSwitches" should {
    "keep browser conversions disabled when only the audience switch is enabled" in {
      val switches = decode[FeatureSwitches]("""{"enableMParticle":"On"}""").toOption.get

      switches.enableMParticle mustBe Some(On)
      switches.enableMParticleConversions mustBe None
    }

    "decode browser conversions independently of the audience switch" in {
      val switches = decode[FeatureSwitches]("""{"enableMParticleConversions":"On"}""").toOption.get

      switches.enableMParticle mustBe None
      switches.enableMParticleConversions mustBe Some(On)
    }
  }

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
          |      "stripeExpressCheckout" : {
          |        "description" : "Stripe - Payment Request Button",
          |        "state" : "On"
          |      },
          |      "payPal" : {
          |        "description" : "PayPal",
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
          |      "stripeExpressCheckout" : {
          |        "description" : "Stripe - Payment Request Button",
          |        "state" : "On"
          |      },
          |      "payPal" : {
          |        "description" : "PayPal",
          |        "state" : "On"
          |      },
          |      "directDebit" : {
          |        "description" : "Direct Debit",
          |        "state" : "On"
          |      },
          |      "stripeHostedCheckout" : {
          |        "description" : "Stripe - Hosted Checkout",
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
          |      },
          |      "authenticateWithOkta" : {
          |        "description" : "Auth is by Okta tokens rather than legacy Identity cookies",
          |        "state" : "Off"
          |      },
          |      "enableCampaignCountdown" : {
          |        "description" : "Enable Campaign Countdown",
          |        "state" : "On"
          |      },
          |      "enableThankYouOnboarding" : {
          |        "description" : "Enables the new Thank You Onboarding flow",
          |        "state" : "Off"
          |      },
          |      "enableCheckoutNudge" : {
          |        "description" : "Enable checkout nudge",
          |        "state" : "On"
          |      },
          |      "enableMParticle" : {
          |        "description" : "Enable mparticle",
          |        "state" : "On"
          |      },
          |      "enableTooledStudentLandingPage" : {
          |        "description" : "Enable tooled student landing page",
          |        "state" : "On"
          |      },
          |      "enableStripePaymentElement" : {
          |        "description" : "Enable Stripe Payment Element",
          |        "state" : "Off"
          |      },
          |      "enableDeepDiscount" : {
          |        "description" : "Enable alternative SupporterPlus card colours and disable Your selection pill copy",
          |        "state" : "Off"
          |      },
          |      "enableStudentBeansEuropeAustralia" : {
          |        "description" : "Enable StudentBeans Australia and Europe (Germany, France, Spain, Ireland, Holland)",
          |        "state" : "Off"
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
          oneOffPaymentMethods = OneOffPaymentMethodSwitches(Some(On), Some(On), Some(On)),
          recurringPaymentMethods = RecurringPaymentMethodSwitches(
            stripe = Some(On),
            stripeApplePay = Some(On),
            stripePaymentRequestButton = Some(On),
            stripeExpressCheckout = Some(On),
            payPal = Some(On),
            directDebit = Some(On),
            stripeHostedCheckout = Some(Off),
          ),
          subscriptionsSwitches = SubscriptionsSwitches(Some(On), Some(On)),
          featureSwitches = FeatureSwitches(
            Some(On),
            Some(On),
            Some(Off),
            Some(On),
            Some(Off),
            Some(On),
            Some(On),
            Some(On),
            Some(Off),
            Some(Off),
            Some(Off),
          ),
          campaignSwitches = CampaignSwitches(Some(Off), Some(Off)),
          recaptchaSwitches = RecaptchaSwitches(Some(On), Some(On)),
        ),
      ))
    }
  }
}
