package controllers

trait CanonicalLinks {

  val supportUrl: String

  def buildCanonicalDigitalSubscriptionLink(countryCode: String, orderIsAGift: Boolean): String =
    if (orderIsAGift) s"${supportUrl}/${countryCode}/subscribe/digital/gift"
    else s"${supportUrl}/${countryCode}/subscribe/digital"

  def buildCanonicalWeeklySubscriptionLink(countryCode: String, orderIsAGift: Boolean): String =
    if (orderIsAGift) s"${supportUrl}/${countryCode}/subscribe/weekly/gift"
    else s"${supportUrl}/${countryCode}/subscribe/weekly"

  def buildCanonicalContributeLink(countryCode: String): String =
    s"${supportUrl}/${countryCode}/contribute"

}
