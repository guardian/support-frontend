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

  private def expectedCookie(name: String) = Cookie(
    name = name,
    value = "1736294400000", // 2025-01-08T00:00:00 as epoch timestamp,
    maxAge = Some(60 * 60 * 24 * 7),
    secure = true,
    httpOnly = false,
    domain = Some("thegulocal.com"),
  )

  "createCookiesForProduct" should "set the gu_allow_reject_all cookie for GuardianAdLite" in {
    val guardianAdLite = GuardianAdLite(GBP)
    val cookies = creator.createCookiesForProduct(guardianAdLite, now)

    cookies should contain(expectedCookie("gu_allow_reject_all"))
    cookies should contain(
      expectedCookie("gu_user_features_expiry"),
    ) // It should also contain the user features expiry cookie
  }
  it should "not set the hide support messaging cookie for Guardian Ad Lite because it is not a supporter product" in {
    val guardianAdLite = GuardianAdLite(GBP)
    val cookies = creator.createCookiesForProduct(guardianAdLite, now)

    cookies should not contain expectedCookie("gu_hide_support_messaging")
    cookies should contain(
      expectedCookie("gu_user_features_expiry"),
    ) // It should also contain the user features expiry cookie
  }

  it should "set the ad-free cookie, the hide supporter revenue cookie and the allow reject all cookie for SupporterPlus" in {
    val supporterPlus = SupporterPlus(BigDecimal(12), GBP, Monthly)
    val cookies = creator.createCookiesForProduct(supporterPlus, now)

    cookies should contain(expectedCookie("GU_AF1"))
    cookies should contain(expectedCookie("gu_hide_support_messaging"))
    cookies should contain(expectedCookie("gu_allow_reject_all"))
    cookies should contain(
      expectedCookie("gu_user_features_expiry"),
    ) // It should also contain the user features expiry cookie
  }

}
