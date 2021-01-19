package conf

import com.gu.conf.ZuoraQuerierConfig
import com.gu.model.Stage.CODE
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

class ZuoraQuerierConfigSpec extends AsyncFlatSpec with Matchers{
  "ZuoraQuerierConfig" should "load from SSM" in {
    val futureConfig = ZuoraQuerierConfig.load(CODE)
    futureConfig.map {
      config =>
        config.url shouldBe "https://rest.apisandbox.zuora.com/v1/"
        config.username shouldNot be("")
        config.password shouldNot be("")
    }
  }
}
