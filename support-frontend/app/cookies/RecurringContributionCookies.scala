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
        value = DateTime.now.getMillis.toString
      ),
      // Setting the user attributes cookies used by frontend. See:
      // https://github.com/guardian/frontend/blob/c1bdb643c2bfd3534575ee5dfd8b94ada6dd9dd6/static/src/javascripts/projects/common/modules/commercial/user-features.js#L69
      cookie(
        name = "gu_user_features_expiry",
        value = DateTime.now.plusDays(1).getMillis.toString
      ),
      cookie(
        name = "gu_recurring_contributor",
        value = true.toString
      ),
      cookie(
        name = "gu_hide_support_messaging",
        value = true.toString
      )
    )
  }
}
