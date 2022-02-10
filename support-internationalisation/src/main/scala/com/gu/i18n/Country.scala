package com.gu.i18n

// ISO 3166 alpha-2, up-to-date as of 23/09/2014
//noinspection ScalaStyle
case class Country(alpha2: String, name: String, statesByCode: Map[String, String] = Map.empty) {
  // Backwards compatibility, including using the 2/3-character codes for Australian states as the name
  val states: Seq[String] = if (alpha2 == "AU") statesByCode.keys.toSeq.sorted else statesByCode.values.toSeq.sorted

  override def toString: String = s"com.gu.i18n.Country.$alpha2"
}

object Country {

  val US = Country(
    alpha2 = "US",
    name = "United States",
    statesByCode = Seq(
      "AK" -> "Alaska",
      "AL" -> "Alabama",
      "AR" -> "Arkansas",
      "AZ" -> "Arizona",
      "CA" -> "California",
      "CO" -> "Colorado",
      "CT" -> "Connecticut",
      "DC" -> "Washington DC",
      "DE" -> "Delaware",
      "FL" -> "Florida",
      "GA" -> "Georgia",
      "GU" -> "Guam",
      "HI" -> "Hawaii",
      "IA" -> "Iowa",
      "ID" -> "Idaho",
      "IL" -> "Illinois",
      "IN" -> "Indiana",
      "KS" -> "Kansas",
      "KY" -> "Kentucky",
      "LA" -> "Louisiana",
      "MA" -> "Massachusetts",
      "MD" -> "Maryland",
      "ME" -> "Maine",
      "MI" -> "Michigan",
      "MN" -> "Minnesota",
      "MO" -> "Missouri",
      "MS" -> "Mississippi",
      "MT" -> "Montana",
      "NC" -> "North Carolina",
      "ND" -> "North Dakota",
      "NE" -> "Nebraska",
      "NH" -> "New Hampshire",
      "NJ" -> "New Jersey",
      "NM" -> "New Mexico",
      "NV" -> "Nevada",
      "NY" -> "New York",
      "OH" -> "Ohio",
      "OK" -> "Oklahoma",
      "OR" -> "Oregon",
      "PA" -> "Pennsylvania",
      "PR" -> "Puerto Rico",
      "RI" -> "Rhode Island",
      "SC" -> "South Carolina",
      "SD" -> "South Dakota",
      "TN" -> "Tennessee",
      "TX" -> "Texas",
      "UT" -> "Utah",
      "VA" -> "Virginia",
      "VI" -> "Virgin Islands",
      "VT" -> "Vermont",
      "WA" -> "Washington",
      "WI" -> "Wisconsin",
      "WV" -> "West Virginia",
      "WY" -> "Wyoming",
      "AA" -> "Armed Forces America",
      "AE" -> "Armed Forces",
      "AP" -> "Armed Forces Pacific",
    ).toMap,
  )

  val Canada = Country(
    alpha2 = "CA",
    name = "Canada",
    statesByCode = Seq(
      "AB" -> "Alberta",
      "BC" -> "British Columbia",
      "MB" -> "Manitoba",
      "NB" -> "New Brunswick",
      "NL" -> "Newfoundland and Labrador",
      "NS" -> "Nova Scotia",
      "NT" -> "Northwest Territories",
      "NU" -> "Nunavut",
      "ON" -> "Ontario",
      "PE" -> "Prince Edward Island",
      "QC" -> "Quebec",
      "SK" -> "Saskatchewan",
      "YT" -> "Yukon",
    ).toMap,
  )

  val UK = Country("GB", "United Kingdom")

  val Australia = Country(
    alpha2 = "AU",
    name = "Australia",
    statesByCode = Seq(
      "SA" -> "South Australia",
      "TAS" -> "Tasmania",
      "NSW" -> "New South Wales",
      "VIC" -> "Victoria",
      "WA" -> "Western Australia",
      "QLD" -> "Queensland",
      "ACT" -> "Australian Capital Territory",
      "NT" -> "Northern Territory",
    ).toMap,
  )

  val NewZealand = Country("NZ", "New Zealand")

  val Ireland = Country("IE", "Ireland")
}
