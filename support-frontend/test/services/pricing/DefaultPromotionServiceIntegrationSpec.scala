package services.pricing

import com.gu.aws.AwsS3Client
import com.gu.support.config.Stages
import com.gu.test.tags.annotations.IntegrationTest
import org.apache.pekko.actor.ActorSystem
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class DefaultPromotionServiceIntegrationSpec extends AsyncFlatSpec with Matchers {
  // Ignored because we may not always have a T3 promo code set up in code
  "DefaultPromotionService" should "return promo codes for a Tier Three" in {
    implicit val s3Client: AwsS3Client = AwsS3Client
    val actorSystem = ActorSystem("test")
    val defaultPromotionService = new DefaultPromotionServiceS3(s3Client, Stages.CODE, actorSystem)
    val promoCodes = defaultPromotionService.fetch()
    promoCodes.get.tierThree should not be empty
  }
}
