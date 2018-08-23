package cookies

import com.gu.support.workers.model.BillingPeriod
import play.api.mvc.Cookie

object RecurringContributionCookie {

  def create(domain: String, billingPeriod: BillingPeriod): Cookie = Cookie(
    name = s"gu.contributions.recurring.contrib-timestamp.$billingPeriod",
    // from the Java docs, this is Epoch time in milliseconds
    value = System.currentTimeMillis.toString,
    secure = true,
    httpOnly = false,
    domain = Some(domain)
  )
}
