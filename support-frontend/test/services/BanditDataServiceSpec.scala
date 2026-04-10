package services

import admin.settings.{EpsilonGreedyBandit, Roulette}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class BanditDataServiceSpec extends AnyFlatSpec with Matchers {

  "BanditData.calculateOverallMeanForVariant" should "handle empty samples" in {
    val samples = List.empty[VariantSample]
    val mean = BanditData.calculateOverallMeanForVariant(samples)
    mean shouldBe 0.0
  }

  it should "calculate mean with single sample" in {
    val samples = List(
      VariantSample("variant-a", 1000.0, 10.0, 100),
    )
    val mean = BanditData.calculateOverallMeanForVariant(samples)
    mean shouldBe 10.0
  }

  it should "weight by views correctly" in {
    val samples = List(
      VariantSample("variant-a", 900.0, 10.0, 90), // 90 views at £10/view
      VariantSample("variant-a", 100.0, 1.0, 10), // 10 views at £1/view
    )
    val mean = BanditData.calculateOverallMeanForVariant(samples)
    // (90*10 + 10*1) / 100 = 910/100 = 9.1
    mean shouldBe 9.1
  }

  "BanditData.buildBanditDataFromSamples" should "handle empty samples" in {
    val result = BanditData.buildBanditDataFromSamples(
      "TEST",
      List.empty,
      List("control", "variant-a"),
    )
    result.sortedVariants.forall(_.mean == 0.0) shouldBe true
  }

  it should "handle exactly 6 samples" in {
    val samples = List.fill(6)(
      TestSample(
        "TEST",
        List(VariantSample("control", 100.0, 10.0, 10)),
        "2026-01-01",
      ),
    )

    val result = BanditData.buildBanditDataFromSamples(
      "TEST",
      samples,
      List("control"),
    )

    result.sortedVariants should have size 1
    result.sortedVariants.head.mean shouldBe 10.0 +- 0.01
  }

  it should "handle variants not present in all samples" in {
    val samples = List(
      TestSample("TEST", List(VariantSample("control", 100.0, 10.0, 10)), "2026-01-01"),
      TestSample("TEST", List(VariantSample("control", 100.0, 10.0, 10)), "2026-01-02"),
      TestSample("TEST", List(VariantSample("control", 100.0, 10.0, 10)), "2026-01-03"),
      TestSample("TEST", List(VariantSample("control", 100.0, 10.0, 10)), "2026-01-04"),
      TestSample("TEST", List(VariantSample("control", 100.0, 10.0, 10)), "2026-01-05"),
      TestSample(
        "TEST",
        List(
          VariantSample("control", 100.0, 10.0, 10),
          VariantSample("variant-a", 200.0, 20.0, 10),
        ),
        "2026-01-06",
      ),
    )

    val result = BanditData.buildBanditDataFromSamples(
      "TEST",
      samples,
      List("control", "variant-a"),
    )

    result.sortedVariants should have size 2
    // variant-a should be first (higher mean)
    result.sortedVariants.head.variantName shouldBe "variant-a"
    result.sortedVariants.head.mean shouldBe 20.0 +- 0.01
    // control appears in all samples
    result.sortedVariants(1).variantName shouldBe "control"
    result.sortedVariants(1).mean shouldBe 10.0 +- 0.01
  }

  it should "sort by mean descending" in {
    val samples = List.fill(6)(
      TestSample(
        "TEST",
        List(
          VariantSample("low", 100.0, 5.0, 20),
          VariantSample("high", 300.0, 15.0, 20),
          VariantSample("medium", 200.0, 10.0, 20),
        ),
        "2026-01-01",
      ),
    )

    val result = BanditData.buildBanditDataFromSamples(
      "TEST",
      samples,
      List("low", "medium", "high"),
    )

    result.sortedVariants.map(_.variantName) shouldBe List("high", "medium", "low")
    result.sortedVariants(0).mean shouldBe 15.0 +- 0.01
    result.sortedVariants(1).mean shouldBe 10.0 +- 0.01
    result.sortedVariants(2).mean shouldBe 5.0 +- 0.01
  }

}
