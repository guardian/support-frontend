package services

import admin.settings._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class VariantSelectionSpec extends AnyFlatSpec with Matchers {

  val testVariants = List(
    LandingPageVariant(
      name = "control",
      copy = LandingPageCopy("Control", "Control subheading"),
      products = Products(None, None, None),
      tickerSettings = None,
      countdownSettings = None,
      defaultProductSelection = None,
    ),
    LandingPageVariant(
      name = "variant-a",
      copy = LandingPageCopy("Variant A", "Variant A subheading"),
      products = Products(None, None, None),
      tickerSettings = None,
      countdownSettings = None,
      defaultProductSelection = None,
    ),
    LandingPageVariant(
      name = "variant-b",
      copy = LandingPageCopy("Variant B", "Variant B subheading"),
      products = Products(None, None, None),
      tickerSettings = None,
      countdownSettings = None,
      defaultProductSelection = None,
    ),
  )

  val testConfig = LandingPageTest(
    name = "TEST_NAME",
    status = Status.Live,
    priority = 1,
    regionTargeting = None,
    mParticleAudience = None,
    variants = testVariants,
    methodologies = Some(List(ABTest())),
  )

  "selectVariantUsingMVT" should "be deterministic" in {
    val mvtId = 12345
    val result1 = VariantSelection.selectVariantUsingMVT(testConfig, mvtId)
    val result2 = VariantSelection.selectVariantUsingMVT(testConfig, mvtId)

    result1 shouldBe defined
    result1 shouldBe result2
  }

  it should "return different variants for different MVT IDs" in {
    val result1 = VariantSelection.selectVariantUsingMVT(testConfig, 1)
    val result2 = VariantSelection.selectVariantUsingMVT(testConfig, 2)
    val result3 = VariantSelection.selectVariantUsingMVT(testConfig, 3)

    result1 shouldBe defined
    result2 shouldBe defined
    result3 shouldBe defined

    // At least one should be different (probabilistically certain with 3 variants)
    Set(result1, result2, result3).size should be > 1
  }

  it should "distribute variants across MVT IDs" in {
    val results = (1 to 1000).map { mvtId =>
      VariantSelection.selectVariantUsingMVT(testConfig, mvtId)
    }.flatten

    // Each variant should appear at least once
    testVariants.foreach { variant =>
      results should contain(variant)
    }

    // Distribution should be roughly even (within 20% of expected)
    val counts = results.groupBy(identity).view.mapValues(_.size).toMap
    counts.values.foreach { count =>
      count should be > 250 // ~33% - 20%
      count should be < 450 // ~33% + 20%
    }
  }

  "selectVariantUsingEpsilonGreedy" should "fall back to random when no bandit data" in {
    val mvtId = 12345
    val result = VariantSelection.selectVariantUsingEpsilonGreedy(
      testConfig,
      epsilon = 0.1,
      testBanditData = None,
      mvtId = mvtId,
    )

    result shouldBe defined
    testVariants should contain(result.get)
  }

  it should "fall back to random when all means are zero" in {
    val banditData = BanditData(
      testName = "TEST_NAME",
      sortedVariants = List(
        VariantMean("control", 0.0),
        VariantMean("variant-a", 0.0),
        VariantMean("variant-b", 0.0),
      ),
    )

    val result = VariantSelection.selectVariantUsingEpsilonGreedy(
      testConfig,
      epsilon = 0.1,
      testBanditData = Some(banditData),
      mvtId = 12345,
    )

    result shouldBe defined
    testVariants should contain(result.get)
  }

  it should "select best variant when epsilon=0" in {
    val banditData = BanditData(
      testName = "TEST_NAME",
      sortedVariants = List(
        VariantMean("variant-b", 15.0), // Best
        VariantMean("variant-a", 10.0),
        VariantMean("control", 5.0),
      ),
    )

    // With epsilon=0, should always exploit (select best)
    val results = (1 to 100).map { mvtId =>
      VariantSelection.selectVariantUsingEpsilonGreedy(
        testConfig,
        epsilon = 0.0,
        testBanditData = Some(banditData),
        mvtId = mvtId,
      )
    }.flatten

    results.foreach { result =>
      result.name shouldBe "variant-b"
    }
  }

  it should "randomly select among tied best variants" in {
    val banditData = BanditData(
      testName = "TEST_NAME",
      sortedVariants = List(
        VariantMean("variant-b", 15.0), // Tied for best
        VariantMean("variant-a", 15.0), // Tied for best
        VariantMean("control", 5.0),
      ),
    )

    // With epsilon=0, should exploit but randomly select among tied best variants
    val results = (1 to 100).map { _ =>
      VariantSelection.selectVariantUsingEpsilonGreedy(
        testConfig,
        epsilon = 0.0,
        testBanditData = Some(banditData),
        mvtId = 12345,
      )
    }.flatten

    val counts = results.groupBy(_.name).view.mapValues(_.size).toMap

    // Both tied variants should appear
    counts("variant-b") should be > 0
    counts("variant-a") should be > 0

    // Control should never appear (not tied for best)
    counts.get("control") shouldBe None
  }

  "selectVariantUsingRoulette" should "fall back to random when no bandit data" in {
    val result = VariantSelection.selectVariantUsingRoulette(
      testConfig,
      testBanditData = None,
      mvtId = 12345,
    )

    result shouldBe defined
    testVariants should contain(result.get)
  }

  it should "weight variants by performance" in {
    val banditData = BanditData(
      testName = "TEST_NAME",
      sortedVariants = List(
        VariantMean("variant-b", 20.0), // 2x better than variant-a
        VariantMean("variant-a", 10.0),
        VariantMean("control", 0.0), // Should still get min weight
      ),
    )

    val results = (1 to 1000).map { mvtId =>
      VariantSelection.selectVariantUsingRoulette(
        testConfig,
        testBanditData = Some(banditData),
        mvtId = mvtId,
      )
    }.flatten

    val counts = results.groupBy(_.name).view.mapValues(_.size).toMap

    // variant-b should appear more than variant-a
    counts("variant-b") should be > counts("variant-a")

    // control should still appear (due to min weight)
    counts("control") should be > 0
  }

  "BanditData.calculateOverallMeanForVariant" should "calculate weighted mean correctly" in {
    val samples = List(
      VariantSample("variant-a", 1000.0, 10.0, 100), // 100 views at £10/view
      VariantSample("variant-a", 500.0, 5.0, 100), // 100 views at £5/view
    )

    val mean = BanditData.calculateOverallMeanForVariant(samples)

    // Weighted mean: (100*10 + 100*5) / (100+100) = 1500/200 = 7.5
    mean shouldBe 7.5
  }

  it should "return 0 when total views is 0" in {
    val samples = List(
      VariantSample("variant-a", 0.0, 0.0, 0),
    )

    val mean = BanditData.calculateOverallMeanForVariant(samples)
    mean shouldBe 0.0
  }

  "BanditData.buildBanditDataFromSamples" should "return zeros with < 6 samples" in {
    val samples = List.fill(5)(
      TestSample("TEST", List(VariantSample("control", 100.0, 10.0, 10)), "2026-01-01"),
    )

    val result = BanditData.buildBanditDataFromSamples(
      "TEST",
      samples,
      List("control", "variant-a"),
    )

    result.sortedVariants.forall(_.mean == 0.0) shouldBe true
  }

  it should "aggregate and sort variants with >= 6 samples" in {
    val samples = List.fill(6)(
      TestSample(
        "TEST",
        List(
          VariantSample("variant-a", 1000.0, 20.0, 50),
          VariantSample("control", 500.0, 10.0, 50),
        ),
        "2026-01-01",
      ),
    )

    val result = BanditData.buildBanditDataFromSamples(
      "TEST",
      samples,
      List("control", "variant-a"),
    )

    result.sortedVariants should have size 2
    result.sortedVariants.head.variantName shouldBe "variant-a" // Best first
    result.sortedVariants.head.mean shouldBe 20.0 +- 0.01
    result.sortedVariants(1).variantName shouldBe "control"
    result.sortedVariants(1).mean shouldBe 10.0 +- 0.01
  }
}
