package controllers

import com.gu.support.workers.ProductType
import config.Configuration.GuardianDomain
import org.joda.time.DateTime
import play.api.mvc.Cookie
import com.gu.support.workers._

case class SubscriptionProductCookiesCreator(domain: GuardianDomain) {
  sealed trait SupportCookie {
    def toPlayCookie: Cookie
  }

  case class SessionCookie(name: String, value: String) extends SupportCookie {
    def toPlayCookie: Cookie = Cookie(
      name = name,
      value = value,
      secure = true,
      httpOnly = false,
      domain = Some(domain.value),
    )
  }

  case class PersistentCookie(name: String, value: String, maxAge: Int) extends SupportCookie {
    def toPlayCookie: Cookie = Cookie(
      name = name,
      value = value,
      maxAge = Some(maxAge),
      secure = true,
      httpOnly = false,
      domain = Some(domain.value),
    )
  }

  def createCookiesForProduct(product: ProductType): List[Cookie] = {
    // Setting the user attributes cookies used by frontend. See:
    // https://github.com/guardian/dotcom-rendering/blob/3c4700cae532993ace6f40c3b59c337f3efe2247/dotcom-rendering/src/client/userFeatures/user-features.ts
    val standardCookies: List[SupportCookie] = List(
      SessionCookie("gu_user_features_expiry", DateTime.now.plusDays(1).getMillis.toString),
      SessionCookie("gu_hide_support_messaging", true.toString),
    )
    val oneWeekInSeconds = 604800
    val productCookies: List[SupportCookie] = product match {
      case Contribution(_, _, billingPeriod) =>
        List(
          SessionCookie(
            s"gu.contributions.recurring.contrib-timestamp.$billingPeriod",
            DateTime.now.getMillis.toString,
          ),
          SessionCookie("gu_recurring_contributor", true.toString),
        )
      case _: SupporterPlus =>
        List(
          SessionCookie("gu_digital_subscriber", true.toString),
          // "gu_supporter_plus" -> true.toString, // TODO: add this and remove the digisub one now that the CMP cookie list has been updated
          SessionCookie("GU_AF1", DateTime.now().plusDays(1).getMillis.toString),
        )
      case _: TierThree =>
        List(
          SessionCookie("gu_digital_subscriber", true.toString),
          // SessionCookie("gu_supporter_plus", true.toString), // TODO: add this and remove the digisub one now that the CMP cookie list has been updated
          SessionCookie("GU_AF1", DateTime.now().plusDays(1).getMillis.toString),
        )
      case _: DigitalPack =>
        List(
          SessionCookie("gu_digital_subscriber", true.toString),
          SessionCookie("GU_AF1", DateTime.now().plusDays(1).getMillis.toString),
        )
      case p: Paper if p.productOptions.hasDigitalSubscription =>
        List(
          SessionCookie("gu_digital_subscriber", true.toString),
          SessionCookie("GU_AF1", DateTime.now().plusDays(1).getMillis.toString),
        )
      case _: Paper => List.empty
      case _: GuardianWeekly => List.empty
      case _: GuardianAdLite => List(PersistentCookie("gu_allow_reject_all", true.toString, oneWeekInSeconds))
    }

    (standardCookies ++ productCookies).map(_.toPlayCookie)
  }
}
