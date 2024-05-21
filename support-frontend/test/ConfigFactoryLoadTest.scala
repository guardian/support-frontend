import com.typesafe.config.ConfigFactory
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec

class ConfigFactoryLoadTest extends AnyWordSpec with Matchers {
  "DEV.public.conf" in {
    noException should be thrownBy ConfigFactory.load("DEV.public.conf")
  }
  "CODE.public.conf" in {
    noException should be thrownBy ConfigFactory.load("CODE.public.conf")
  }
  "PROD.public.conf" in {
    noException should be thrownBy ConfigFactory.load("PROD.public.conf")
  }
}
