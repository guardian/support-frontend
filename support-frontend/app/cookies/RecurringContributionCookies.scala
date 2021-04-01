package cookies

import com.gu.support.workers.BillingPeriod
import config.Configuration.GuardianDomain
import org.joda.time.DateTime
import play.api.mvc.Cookie

object RecurringContributionCookies {
  def create(domain: GuardianDomain, billingPeriod: BillingPeriod): List[Cookie] = {
    def cookie(name: String, value:String) = Cookie(
      name = name,
      value = value,
      secure = true,
      httpOnly = false,
      domain = Some(domain.value)
    )
    List(
      cookie(
        name = s"gu.contributions.recurring.contrib-timestamp.$billingPeriod",
        value = DateTime.now.getMillis.toString,
      ),
      cookie(
        name = "gu_user_features_expiry",
        value = DateTime.now.plusDays(1).getMillis.toString,
      ),
      cookie(
        name = "gu_recurring_contributor",
        value = true.toString,
      ),
      cookie(
        name = "gu_hide_support_messaging",
        value = true.toString,
      ),
    )
  }
}
