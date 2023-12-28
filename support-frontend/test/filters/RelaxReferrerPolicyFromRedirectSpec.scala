package filters

import akka.stream.Materializer
import com.typesafe.scalalogging.StrictLogging
import org.scalatestplus.play.PlaySpec
import org.scalatestplus.play.guice.GuiceOneAppPerSuite
import play.api.Application
import play.api.inject.guice.GuiceApplicationBuilder
import play.api.mvc.Results.Ok
import play.api.mvc.{DefaultActionBuilder, EssentialAction}
import play.api.test.FakeRequest
import play.filters.headers.SecurityHeadersFilter

import scala.concurrent.ExecutionContext.Implicits.global

class RelaxReferrerPolicyFromRedirectSpec extends PlaySpec with GuiceOneAppPerSuite with StrictLogging {
  override def fakeApplication(): Application = {
    GuiceApplicationBuilder().build()
  }

  implicit lazy val materializer: Materializer = app.materializer
  implicit lazy val Action: DefaultActionBuilder = app.injector.instanceOf(classOf[DefaultActionBuilder])

  "RemoveReferrerPolicyFromRedirectSpec" should {
    "Replaces any previously set Referrer-Policy headers" in {
      val filter = new RelaxReferrerPolicyFromRedirectFilter()
      val rh = FakeRequest()
      val action: EssentialAction = Action(Ok("Ok"))
      // We know this filter adds a Referrer-Policy header
      // And is actually the filter we use in the App
      val securityHeadersFilter = SecurityHeadersFilter()
      val nextResult = securityHeadersFilter(action)
      val result = filter(nextResult)(rh).run()

      result.foreach(result => println(result.header.headers.get(SecurityHeadersFilter.REFERRER_POLICY)))
    }
  }
}
