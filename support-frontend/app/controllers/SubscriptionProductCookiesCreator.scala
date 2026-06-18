package controllers

import com.gu.support.workers.ProductType
import config.Configuration.GuardianDomain
import org.joda.time.DateTime
import play.api.mvc.Cookie
import com.gu.support.workers._

case class SubscriptionProductCookiesCreator(domain: GuardianDomain) {
  private val oneDayInSeconds = 60 * 60 * 24;
  private val benefitsCookieLengthInDays = 30
  private val benefitsExpiryCookieLengthInDays = 1

  private def persistentCookieWithMaxAge(name: String, now: DateTime, maxAgeInDays: Int) = {
    val expiryTime = now.plusDays(maxAgeInDays).withTimeAtStartOfDay().getMillis.toString
    Cookie(
      name = name,
      value = expiryTime,
      maxAge = Some(oneDayInSeconds * maxAgeInDays),
      secure = true,
      httpOnly = false,
      domain = Some(domain.value),
    )
  }
  private def adFreeCookie(now: DateTime) =
    persistentCookieWithMaxAge(name = "GU_AF1", now = now, maxAgeInDays = benefitsCookieLengthInDays)

  private def hideSupportMessagingCookie(now: DateTime) =
    persistentCookieWithMaxAge(name = "gu_hide_support_messaging", now = now, maxAgeInDays = benefitsCookieLengthInDays)

  private def allowRejectAllCookie(now: DateTime) =
    persistentCookieWithMaxAge(name = "gu_allow_reject_all", now = now, maxAgeInDays = benefitsCookieLengthInDays)

  private def userBenefitsExpiryCookie(now: DateTime) =
    persistentCookieWithMaxAge(
      name = "gu_user_benefits_expiry",
      now = now,
      maxAgeInDays = benefitsExpiryCookieLengthInDays,
    )

  def createCookiesForProduct(product: ProductType, now: DateTime): List[Cookie] = {
    // Setting the user benefits cookies used by frontend. See:
    // https://github.com/guardian/dotcom-rendering/blob/3c4700cae532993ace6f40c3b59c337f3efe2247/dotcom-rendering/src/client/userFeatures/user-features.ts

    val productCookies: List[Cookie] = product match {
      case _: SupporterPlus | _: TierThree | _: DigitalPack | _: Paper =>
        List(adFreeCookie(now), allowRejectAllCookie(now), hideSupportMessagingCookie(now))

      case _: Contribution | _: GuardianWeekly => List(hideSupportMessagingCookie(now))

      case _: GuardianAdLite => List(allowRejectAllCookie(now))
    }

    userBenefitsExpiryCookie(now) :: productCookies
  }
}
