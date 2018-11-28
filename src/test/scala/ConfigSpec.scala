import com.gu.support.config.{PromotionsTablesConfigProvider, Stages}
import com.typesafe.config.ConfigFactory
import org.scalatest.{FlatSpec, Matchers}

class ConfigSpec extends FlatSpec with Matchers{
  "PromotionsTablesConfigProvider" should "load successfully" in {
    val provider = new PromotionsTablesConfigProvider(ConfigFactory.load(), Stages.DEV)
    provider.get().promotions shouldBe "MembershipSub-Promotions-DEV"
  }
}
