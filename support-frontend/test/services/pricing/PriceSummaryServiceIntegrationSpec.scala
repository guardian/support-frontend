package services.pricing

import akka.actor.ActorSystem
import com.gu.aws.AwsS3Client
import com.gu.i18n.CountryGroup.{UK, US}
import com.gu.support.catalog._
import com.gu.support.config.{Stages, TouchPointEnvironments}
import com.gu.support.promotions.PromotionServiceSpec
import com.gu.support.workers.{Annual, Quarterly}
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class PriceSummaryServiceIntegrationSpec extends AsyncFlatSpec with Matchers with LazyLogging {
  val actorSystem = ActorSystem("test")
  val defaultPromotionsService = new DefaultPromotionServiceS3(AwsS3Client, Stages.DEV, actorSystem)
  val service =
    new PriceSummaryService(
      PromotionServiceSpec.serviceWithDynamo,
      defaultPromotionsService,
      CatalogService(TouchPointEnvironments.SANDBOX),
    )

  "PriceSummaryService" should "return prices" in {
    val result = service.getPrices(GuardianWeekly, List("WJW7OAJ3A"))
    result.size shouldBe 7
    result(UK)(Domestic)(NoProductOptions).size shouldBe 4
  }

  it should "return gift prices" in {
    val gift = service.getPrices(GuardianWeekly, Nil, Gift)
    gift.size shouldBe 7
    gift(US)(RestOfWorld)(NoProductOptions).size shouldBe 2 // Annual and three month
    gift(US)(RestOfWorld)(NoProductOptions).find(_._1 == Annual) shouldBe defined
    gift(US)(RestOfWorld)(NoProductOptions).find(_._1 == Quarterly) shouldBe defined
  }
}
