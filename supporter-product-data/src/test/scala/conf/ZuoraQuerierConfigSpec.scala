package conf

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage.DEV
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

@IntegrationTest
class ZuoraQuerierConfigSpec extends AsyncFlatSpec with Matchers{
  "ZuoraQuerierConfig" should "load from SSM" in {
    val futureConfig = ZuoraQuerierConfig.load(DEV)
    futureConfig.map {
      config =>
        config.url shouldBe "https://rest.apisandbox.zuora.com/v1/"
        config.username shouldNot be("")
        config.password shouldNot be("")
    }
  }
}
