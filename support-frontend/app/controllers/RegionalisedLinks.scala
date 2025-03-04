package controllers

trait RegionalisedLinks {

  val supportUrl: String

  def buildRegionalisedWeeklySubscriptionLink(countryCode: String, orderIsAGift: Boolean): String =
    if (orderIsAGift) s"${supportUrl}/${countryCode}/subscribe/weekly/gift"
    else s"/${countryCode}/subscribe/weekly"

  def buildRegionalisedContributeLink(countryCode: String): String =
    s"/${countryCode}/contribute"

}
