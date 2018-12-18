package controllers

trait CanonicalLinks {

  val supportUrl: String

  def buildCanonicalPaperSubscriptionLink(withDelivery: Boolean = false): String =
    if (withDelivery) s"${supportUrl}/uk/subscribe/paper/delivery"
    else s"${supportUrl}/uk/subscribe/paper"

  def buildCanonicalDigitalSubscriptionLink(countryCode: String): String =
    s"${supportUrl}/${countryCode}/subscribe/digital"

  def buildCanonicalWeeklySubscriptionLink(countryCode: String): String =
    s"${supportUrl}/${countryCode}/subscribe/weekly"

}
