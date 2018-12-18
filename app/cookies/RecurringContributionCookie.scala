package cookies

import com.gu.support.workers.BillingPeriod
import config.Configuration.GuardianDomain
import play.api.mvc.Cookie

object RecurringContributionCookie {

  def create(domain: GuardianDomain, billingPeriod: BillingPeriod): Cookie = Cookie(
    name = s"gu.contributions.recurring.contrib-timestamp.$billingPeriod",
    // from the Java docs, this is Epoch time in milliseconds
    value = System.currentTimeMillis.toString,
    secure = true,
    httpOnly = false,
    domain = Some(domain.value)
  )
}
