package services

import admin.settings._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.apache.pekko.actor.ActorSystem
import scala.concurrent.ExecutionContext.Implicits.global

class BanditDataServiceSpec extends AnyFlatSpec with Matchers {

  implicit val actorSystem: ActorSystem = ActorSystem("test")

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

  "getBanditTestConfigs" should "extract bandit methodologies from landing page tests" in {
    // Create test data
    val tests = List(
      LandingPageTest(
        name = "test-1",
        status = Status.Live,
        priority = 1,
        regionTargeting = None,
        mParticleAudience = None,
        variants = List(
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
        ),
        methodologies = Some(
          List(
            EpsilonGreedyBandit(epsilon = 0.1),
            Roulette(),
          ),
        ),
      ),
      LandingPageTest(
        name = "test-2",
        status = Status.Live,
        priority = 2,
        regionTargeting = None,
        mParticleAudience = None,
        variants = List(
          LandingPageVariant(
            name = "control",
            copy = LandingPageCopy("Control", "Control subheading"),
            products = Products(None, None, None),
            tickerSettings = None,
            countdownSettings = None,
            defaultProductSelection = None,
          ),
        ),
        methodologies = Some(
          List(
            ABTest(), // First methodology is ABTest, so no bandit data needed for this test
            EpsilonGreedyBandit(epsilon = 0.2, sampleCount = Some(10)),
          ),
        ),
      ),
    )

    // Create a minimal BanditDataService instance just to test the methodology extraction
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = tests
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService) {
      override def getBanditData(): List[BanditData] = Nil
    }

    // Test the methodology extraction
    val configs = service.getBanditTestConfigs(tests)

    configs should have size 1 // Only test-1 needs bandit data (first methodology is EpsilonGreedyBandit)

    // First test - uses first bandit methodology (EpsilonGreedyBandit), testName is test.name
    val config1 = configs.find(_.testName == "test-1")
    config1 should be(defined)
    config1.get.banditTableTestName shouldBe "SupportLandingPage_test-1"
    config1.get.variantNames shouldBe List("control", "variant-a")
    config1.get.sampleCount shouldBe None

    // Second test - first methodology is ABTest, so no bandit data config is generated
    val config2 = configs.find(_.testName == "test-2")
    config2 should be(empty)
  }

  "getClientBanditData" should "normalise weights to sum to 1.0" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService) {
      override def getBanditData(): List[BanditData] = List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("v1", 10.0),
            VariantMean("v2", 20.0),
            VariantMean("v3", 30.0),
          ),
        ),
      )
    }

    // Set cached data directly since getClientBanditData reads from cache
    service.cachedBanditData.set(
      List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("v1", 10.0),
            VariantMean("v2", 20.0),
            VariantMean("v3", 30.0),
          ),
        ),
      ),
    )

    val clientData = service.getClientBanditData()

    clientData should have size 1
    val test1Data = clientData.head
    test1Data.testName shouldBe "test-1"
    test1Data.variants should have size 3

    // Weights should be normalised: 10/60=0.1667, 20/60=0.3333, 30/60=0.5
    val weights = test1Data.variants.map(_.weight)
    weights.sum shouldBe 1.0 +- 0.0001
    weights(0) shouldBe 0.1667 +- 0.0001
    weights(1) shouldBe 0.3333 +- 0.0001
    weights(2) shouldBe 0.5 +- 0.0001
  }

  it should "return all zero weights when sumOfMeans is zero" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService)

    service.cachedBanditData.set(
      List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("v1", 0.0),
            VariantMean("v2", 0.0),
          ),
        ),
      ),
    )

    val clientData = service.getClientBanditData()

    clientData should have size 1
    val test1Data = clientData.head
    test1Data.variants.foreach(_.weight shouldBe 0.0)
  }

  it should "clamp all negative means to zero weights" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService)

    service.cachedBanditData.set(
      List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("v1", -10.0),
            VariantMean("v2", -5.0),
          ),
        ),
      ),
    )

    val clientData = service.getClientBanditData()

    clientData should have size 1
    val test1Data = clientData.head
    test1Data.variants.foreach(_.weight shouldBe 0.0)
  }

  it should "handle empty bandit data" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService)

    service.cachedBanditData.set(Nil)

    val clientData = service.getClientBanditData()

    clientData shouldBe empty
  }

  it should "handle single variant" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService)

    service.cachedBanditData.set(
      List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("v1", 100.0),
          ),
        ),
      ),
    )

    val clientData = service.getClientBanditData()

    clientData should have size 1
    val test1Data = clientData.head
    test1Data.variants should have size 1
    test1Data.variants.head.weight shouldBe 1.0
  }

  it should "preserve variant names from bandit data" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService)

    service.cachedBanditData.set(
      List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("control", 10.0),
            VariantMean("variant-a", 20.0),
          ),
        ),
      ),
    )

    val clientData = service.getClientBanditData()

    clientData.head.variants.map(_.name) shouldBe List("control", "variant-a")
  }

  it should "clamp negative means to zero before normalising weights" in {
    val mockTestService = new LandingPageTestService {
      def getTests(): List[LandingPageTest] = Nil
      def channelName: String = "SupportLandingPage"
    }

    val service = new BanditDataService(com.gu.support.config.Stages.CODE, mockTestService)

    service.cachedBanditData.set(
      List(
        BanditData(
          testName = "test-1",
          sortedVariants = List(
            VariantMean("v1", 2.0),
            VariantMean("v2", -1.0),
            VariantMean("v3", 1.0),
          ),
        ),
      ),
    )

    val clientData = service.getClientBanditData()

    clientData should have size 1
    val test1Data = clientData.head
    test1Data.testName shouldBe "test-1"
    test1Data.variants should have size 3

    val weights = test1Data.variants.map(_.weight)
    weights.sum shouldBe 1.0 +- 0.0001
    weights(0) shouldBe 0.6667 +- 0.0001
    weights(1) shouldBe 0.0 +- 0.0001
    weights(2) shouldBe 0.3333 +- 0.0001
  }

}
