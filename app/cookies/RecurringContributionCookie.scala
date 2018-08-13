package cookies

import java.time.Instant

import com.gu.support.workers.model.BillingPeriod
import play.api.mvc.Cookie

object RecurringContributionCookie {

  val currentTime = Instant.ofEpochSecond(System.currentTimeMillis / 1000).toEpochMilli.toString

  def create(domain: String, billingPeriod: BillingPeriod): Cookie = Cookie(
    name = s"gu.contributions.recurring.contrib-timestamp.$billingPeriod",
    value = currentTime,
    secure = true,
    httpOnly = false,
    domain = Some(domain)
  )
}
