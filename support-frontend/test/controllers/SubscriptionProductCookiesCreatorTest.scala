package controllers

import com.gu.i18n.Currency.GBP
import com.gu.support.workers.{GuardianAdLite, Monthly, SupporterPlus}
import config.Configuration.GuardianDomain
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import play.api.mvc.Cookie
import org.joda.time.DateTime

class SubscriptionProductCookiesCreatorTest extends AnyFlatSpec with Matchers {
  "createCookiesForProduct" should "set the gu_allow_reject_all cookie for GuardianAdLite" in {
    val guardianAdLite = GuardianAdLite(GBP)
    val creator = SubscriptionProductCookiesCreator(GuardianDomain("thegulocal.com"))

    val now = DateTime.now()
    val cookies = creator.createCookiesForProduct(guardianAdLite, now)

    val expectedCookie = Cookie(
      name = "gu_allow_reject_all",
      value = "true",
      maxAge = Some(604800),
      secure = true,
      httpOnly = false,
      domain = Some("thegulocal.com"),
    )
    cookies should contain(expectedCookie)
  }

  it should "set the gu_digital_subscriber cookie for SupporterPlus" in {
    val supporterPlus = SupporterPlus(BigDecimal(12), GBP, Monthly)
    val creator = SubscriptionProductCookiesCreator(GuardianDomain("thegulocal.com"))

    val now = new DateTime("2025-01-01T00:00:00")
    val cookies = creator.createCookiesForProduct(supporterPlus, now)

    val expectedCookie = Cookie(
      name = "GU_AF1",
      value = "1735776000000", // Jan 2nd 2024 millis
      secure = true,
      httpOnly = false,
      domain = Some("thegulocal.com"),
    )
    cookies should contain(expectedCookie)
  }
}
