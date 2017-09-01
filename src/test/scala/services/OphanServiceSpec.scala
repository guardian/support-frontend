package services

import fixtures.ExampleABTest
import org.scalatest.{MustMatchers, WordSpec}

class OphanServiceSpec extends WordSpec with MustMatchers {
  val browserId = "browserId"
  val visitId = "visitId"

  "OphanService" must {
    import io.circe.syntax._
    import instances.abTestInfo._
    import syntax._

    "extract correct A/B test data" in {

      val tests = Set(
        ExampleABTest("test1", "control1"),
        ExampleABTest("test2", "control2")
      )

      tests.asAbTestInfo.asJson.noSpaces mustBe
        """{"test1":{"variantName":"control1"},"test2":{"variantName":"control2"}}"""
    }

//    "encode query parameters correctly" in {
//      import com.netaporter.uri.Uri.parse
//
//      val acquisition = Acquisition(
//        product = Contribution,
//        paymentFrequency = PaymentFrequency.OneOff,
//        currency = "GBP",
//        amount = 10.12,
//        amountInGBP = Some(10.12),
//        paymentProvider = Some(PaymentProvider.Stripe),
//        campaignCode = Some(Set("woot", "poot")),
//        abTests = Some(Set(ExampleABTest("test1", "control")).asAbTestInfo),
//        countryCode = Some("US"),
//        referrerPageViewId = Some("refpivd"),
//        referrerUrl = Some("refurl"),
//        componentId = Some("my-great-component"),
//        componentTypeV2 = Some(AcquisitionsEpic),
//        source = Some(GuardianWeb)
//      )
//
//      val paramsFromEvent: Map[String, String] = AcquisitionUtils.queryParamsFor(acquisition)
//      val url: Uri = parse(ophanService.url(paramsFromEvent).toString)
//      val paramsFromUrl: Map[String, String] = url.query.params.toMap.collect { case (k, Some(v)) => k -> v }
//
//      paramsFromEvent mustEqual paramsFromUrl
//    }
  }
}
