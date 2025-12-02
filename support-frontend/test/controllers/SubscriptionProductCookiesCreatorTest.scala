package controllers

import com.gu.i18n.Currency.GBP
import com.gu.support.workers.{GuardianAdLite, Monthly, SupporterPlus}
import config.Configuration.GuardianDomain
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import play.api.mvc.Cookie
import org.joda.time.DateTime

class SubscriptionProductCookiesCreatorTest extends AnyFlatSpec with Matchers {
  private val now = DateTime.parse("2025-01-01T00:00:00")
  private val creator = SubscriptionProductCookiesCreator(GuardianDomain("thegulocal.com"))

  private def expectedCookie(name: String, ageInDays: Int) = {
    val ageInSeconds = ageInDays * 24 * 60 * 60

    Cookie(
      name = name,
      value = s"${now.getMillis + (ageInSeconds * 1000)}",
      maxAge = Some(ageInSeconds),
      secure = true,
      httpOnly = false,
      domain = Some("thegulocal.com"),
    )
  }

  "createCookiesForProduct" should "set the gu_allow_reject_all cookie for GuardianAdLite" in {
    val guardianAdLite = GuardianAdLite(GBP)
    val cookies = creator.createCookiesForProduct(guardianAdLite, now)

    cookies should contain(expectedCookie(name = "gu_allow_reject_all", ageInDays = 7))
    // It should also contain the user features expiry cookie
    cookies should contain(expectedCookie(name = "gu_user_benefits_expiry", ageInDays = 7))
  }

  it should "not set the hide support messaging cookie for Guardian Ad Lite because it is not a supporter product" in {
    val guardianAdLite = GuardianAdLite(GBP)
    val cookies = creator.createCookiesForProduct(guardianAdLite, now)

    cookies.map(_.name) should not contain "gu_hide_support_messaging"
    // It should also contain the user features expiry cookie
    cookies should contain(expectedCookie(name = "gu_user_benefits_expiry", ageInDays = 7))
  }

  it should "set the ad-free cookie, the hide supporter revenue cookie and the allow reject all cookie for SupporterPlus" in {
    val supporterPlus = SupporterPlus(BigDecimal(12), GBP, Monthly)
    val cookies = creator.createCookiesForProduct(supporterPlus, now)

    cookies should contain(expectedCookie(name = "GU_AF1", ageInDays = 7))
    cookies should contain(expectedCookie(name = "gu_hide_support_messaging", ageInDays = 7))
    cookies should contain(expectedCookie(name = "gu_allow_reject_all", ageInDays = 7))
    // It should also contain the user features expiry cookie
    cookies should contain(expectedCookie(name = "gu_user_benefits_expiry", ageInDays = 7))
  }

}
