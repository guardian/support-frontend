package com.gu.i18n

import java.util.Locale

case class CountryGroup(
    name: String,
    id: String,
    defaultCountry: Option[Country],
    countries: List[Country],
    currency: Currency,
    postalCode: PostalCode,
    additionalCurrencies: List[Currency] = Nil,
) {
  def supportedCurrencies: List[Currency] = currency :: additionalCurrencies
}

object CountryGroup {

  import Currency._

  val C = Country
  val Canada = CountryGroup("Canada", "ca", Some(C.Canada), List(C.Canada), CAD, ZipCode)

  val US = CountryGroup("United States", "us", Some(C.US), List(C.US), USD, ZipCode)

  val UK = CountryGroup(
    "United Kingdom",
    "uk",
    Some(C.UK),
    List(
      C.UK,
      Country("FK", "Falkland Islands"),
      Country("GI", "Gibraltar"),
      Country("GG", "Guernsey"),
      Country("IM", "Isle of Man"),
      Country("JE", "Jersey"),
      Country("SH", "Saint Helena"),
    ),
    GBP,
    PostCode,
  )

  val Australia = CountryGroup(
    "Australia",
    "au",
    Some(C.Australia),
    List(
      C.Australia,
      Country("KI", "Kiribati"),
      Country("NR", "Nauru"),
      Country("NF", "Norfolk Island"),
      Country("TV", "Tuvalu"),
    ),
    AUD,
    PostCode,
  )

  val NewZealand = CountryGroup(
    "New Zealand",
    "nz",
    Some(C.NewZealand),
    List(
      C.NewZealand,
      Country("CK", "Cook Islands"),
    ),
    NZD,
    PostCode,
  )

  val Europe = CountryGroup(
    "Europe",
    "eu",
    None,
    List(
      Country("AD", "Andorra"),
      Country("AL", "Albania"),
      Country("AT", "Austria"),
      Country("BA", "Bosnia-Herzegovina"),
      Country("BE", "Belgium"),
      Country("BG", "Bulgaria"),
      Country("BL", "Saint Barthélemy"),
      Country("CH", "Switzerland"),
      Country("CY", "Cyprus"),
      Country("CZ", "Czech Republic"),
      Country("DE", "Germany"),
      Country("DK", "Denmark"),
      Country("EE", "Estonia"),
      Country("ES", "Spain"),
      Country("FI", "Finland"),
      Country("FO", "Faroe Islands"),
      Country("FR", "France"),
      Country("GF", "French Guiana"),
      Country("GL", "Greenland"),
      Country("GP", "Guadeloupe"),
      Country("GR", "Greece"),
      Country("HR", "Croatia"),
      Country("HU", "Hungary"),
      C.Ireland,
      Country("IT", "Italy"),
      Country("LI", "Liechtenstein"),
      Country("LT", "Lithuania"),
      Country("LU", "Luxembourg"),
      Country("LV", "Latvia"),
      Country("MC", "Monaco"),
      Country("ME", "Montenegro"),
      Country("MF", "Saint Martin"),
      Country("IS", "Iceland"),
      Country("MQ", "Martinique"),
      Country("MT", "Malta"),
      Country("NL", "Netherlands"),
      Country("NO", "Norway"),
      Country("PF", "French Polynesia"),
      Country("PL", "Poland"),
      Country("PM", "Saint Pierre & Miquelon"),
      Country("PT", "Portugal"),
      Country("RE", "Réunion"),
      Country("RO", "Romania"),
      Country("RS", "Serbia"),
      Country("SE", "Sweden"),
      Country("SI", "Slovenia"),
      Country("SJ", "Svalbard and Jan Mayen"),
      Country("SK", "Slovakia"),
      Country("SM", "San Marino"),
      Country("TF", "French Southern Territories"),
      Country("WF", "Wallis & Futuna"),
      Country("YT", "Mayotte"),
      Country("VA", "Holy See"),
      Country("AX", "Åland Islands"),
    ),
    EUR,
    PostCode,
  )

  val RestOfTheWorld = CountryGroup(
    "International",
    "int",
    None,
    List(
      Country("AE", "United Arab Emirates"),
      Country("AF", "Afghanistan"),
      Country("AG", "Antigua & Barbuda"),
      Country("AI", "Anguilla"),
      Country("AM", "Armenia"),
      Country("AO", "Angola"),
      Country("AQ", "Antarctica"),
      Country("AR", "Argentina"),
      Country("AS", "American Samoa"),
      Country("AW", "Aruba"),
      Country("AZ", "Azerbaijan"),
      Country("BB", "Barbados"),
      Country("BD", "Bangladesh"),
      Country("BF", "Burkina Faso"),
      Country("BH", "Bahrain"),
      Country("BI", "Burundi"),
      Country("BJ", "Benin"),
      Country("BM", "Bermuda"),
      Country("BN", "Brunei Darussalam"),
      Country("BO", "Bolivia"),
      Country("BQ", "Bonaire, Saint Eustatius and Saba"),
      Country("BR", "Brazil"),
      Country("BS", "Bahamas"),
      Country("BT", "Bhutan"),
      Country("BV", "Bouvet Island"),
      Country("BW", "Botswana"),
      Country("BY", "Belarus"),
      Country("BZ", "Belize"),
      Country("CC", "Cocos (Keeling) Islands"),
      Country("CD", "Congo (Kinshasa)"),
      Country("CF", "Central African Republic"),
      Country("CG", "Congo (Brazzaville)"),
      Country("CI", "Ivory Coast"),
      Country("CL", "Chile"),
      Country("CM", "Cameroon"),
      Country("CN", "China"),
      Country("CO", "Colombia"),
      Country("CR", "Costa Rica"),
      Country("CU", "Cuba"),
      Country("CV", "Cape Verde Islands"),
      Country("CW", "Curaçao"),
      Country("CX", "Christmas Island"),
      Country("DJ", "Djibouti"),
      Country("DM", "Dominica"),
      Country("DO", "Dominican Republic"),
      Country("DZ", "Algeria"),
      Country("EC", "Ecuador"),
      Country("EG", "Egypt"),
      Country("EH", "Western Sahara"),
      Country("ER", "Eritrea"),
      Country("ET", "Ethiopia"),
      Country("FJ", "Fiji"),
      Country("FM", "Micronesia"),
      Country("GA", "Gabon"),
      Country("GD", "Grenada"),
      Country("GE", "Georgia"),
      Country("GH", "Ghana"),
      Country("GM", "Gambia"),
      Country("GN", "Guinea"),
      Country("GQ", "Equatorial Guinea"),
      Country("GS", "South Georgia & The South Sandwich Islands"),
      Country("GT", "Guatemala"),
      Country("GU", "Guam"),
      Country("GW", "Guinea-Bissau"),
      Country("GY", "Guyana"),
      Country("HK", "Hong Kong"),
      Country("HM", "Heard Island and McDonald Islands"),
      Country("HN", "Honduras"),
      Country("HT", "Haiti"),
      Country("ID", "Indonesia"),
      Country("IL", "Israel"),
      Country("IN", "India"),
      Country("IO", "British Indian Ocean Territory"),
      Country("IQ", "Iraq"),
      Country("IR", "Iran"),
      Country("JM", "Jamaica"),
      Country("JO", "Jordan"),
      Country("JP", "Japan"),
      Country("KE", "Kenya"),
      Country("KG", "Kyrgyzstan"),
      Country("KH", "Cambodia"),
      Country("KM", "Comoros"),
      Country("KN", "Saint Christopher & Nevis"),
      Country("KP", "North Korea"),
      Country("KR", "South Korea"),
      Country("KW", "Kuwait"),
      Country("KY", "Cayman Islands"),
      Country("KZ", "Kazakhstan"),
      Country("LA", "Laos"),
      Country("LB", "Lebanon"),
      Country("LC", "Saint Lucia"),
      Country("LK", "Sri Lanka"),
      Country("LR", "Liberia"),
      Country("LS", "Lesotho"),
      Country("LY", "Libya"),
      Country("MA", "Morocco"),
      Country("MD", "Moldova"),
      Country("MG", "Madagascar"),
      Country("MH", "Marshall Islands"),
      Country("MK", "Macedonia"),
      Country("ML", "Mali"),
      Country("MM", "Myanmar"),
      Country("MN", "Mongolia"),
      Country("MO", "Macau"),
      Country("MP", "Northern Mariana Islands"),
      Country("MR", "Mauritania"),
      Country("MS", "Montserrat"),
      Country("MU", "Mauritius"),
      Country("MV", "Maldives"),
      Country("MW", "Malawi"),
      Country("MX", "Mexico"),
      Country("MY", "Malaysia"),
      Country("MZ", "Mozambique"),
      Country("NA", "Namibia"),
      Country("NC", "New Caledonia"),
      Country("NE", "Niger"),
      Country("NG", "Nigeria"),
      Country("NI", "Nicaragua"),
      Country("NP", "Nepal"),
      Country("NU", "Niue"),
      Country("OM", "Oman"),
      Country("PA", "Panama"),
      Country("PE", "Peru"),
      Country("PG", "Papua New Guinea"),
      Country("PH", "Philippines"),
      Country("PK", "Pakistan"),
      Country("PN", "Pitcairn Islands"),
      Country("PR", "Puerto Rico"),
      Country("PS", "Palestinian Territories"),
      Country("PW", "Palau"),
      Country("PY", "Paraguay"),
      Country("QA", "Qatar"),
      Country("RU", "Russia"),
      Country("RW", "Rwanda"),
      Country("SA", "Saudi Arabia"),
      Country("SB", "Solomon Islands"),
      Country("SC", "Seychelles"),
      Country("SD", "Sudan"),
      Country("SG", "Singapore"),
      Country("SL", "Sierra Leone"),
      Country("SN", "Senegal"),
      Country("SO", "Somalia"),
      Country("SR", "Suriname"),
      Country("SS", "South Sudan"),
      Country("ST", "Sao Tome & Principe"),
      Country("SV", "El Salvador"),
      Country("SX", "Sint Maarten"),
      Country("SY", "Syria"),
      Country("SZ", "Swaziland"),
      Country("TC", "Turks & Caicos Islands"),
      Country("TD", "Chad"),
      Country("TG", "Togo"),
      Country("TH", "Thailand"),
      Country("TJ", "Tajikistan"),
      Country("TK", "Tokelau"),
      Country("TL", "East Timor"),
      Country("TM", "Turkmenistan"),
      Country("TN", "Tunisia"),
      Country("TO", "Tonga"),
      Country("TR", "Turkey"),
      Country("TT", "Trinidad & Tobago"),
      Country("TW", "Taiwan"),
      Country("TZ", "Tanzania"),
      Country("UA", "Ukraine"),
      Country("UG", "Uganda"),
      Country("UM", "United States Minor Outlying Islands"),
      Country("UY", "Uruguay"),
      Country("UZ", "Uzbekistan"),
      Country("VC", "Saint Vincent & The Grenadines"),
      Country("VE", "Venezuela"),
      Country("VG", "British Virgin Islands"),
      Country("VI", "United States Virgin Islands"),
      Country("VN", "Vietnam"),
      Country("VU", "Vanuatu"),
      Country("WS", "Samoa"),
      Country("YE", "Yemen"),
      Country("ZA", "South Africa"),
      Country("ZM", "Zambia"),
      Country("ZW", "Zimbabwe"),
    ),
    USD,
    PostCode,
    List(GBP),
  )

  val allGroups = List(
    UK,
    US,
    Canada,
    Australia,
    NewZealand,
    Europe,
    RestOfTheWorld,
  )

  val countries: List[Country] = allGroups.flatMap(_.countries).sortBy(_.name)

  val countriesByISO2: Map[String, Country] = countries.map { c => c.alpha2 -> c }.toMap

  val countriesByISO3 = countries.map { country =>
    val locale = new Locale("", country.alpha2)
    locale.getISO3Country.toUpperCase -> country
  }.toMap

  def countryByCode(str: String): Option[Country] = {
    val code = str.toUpperCase
    countriesByISO2.get(code) orElse countriesByISO3.get(code)
  }

  def countryByName(str: String): Option[Country] = countries.find { _.name.equalsIgnoreCase(str) }

  // This is because there was an inconsistency in the code where we were writing a country name
  // in Identity but then trying to find it by code. It's not clear anymore which we have in our systems; probably both
  def countryByNameOrCode(str: String): Option[Country] = countries.find { _.name == str } orElse countryByCode(str)

  def byCountryCode(c: String): Option[CountryGroup] = allGroups.find(_.countries.exists(_.alpha2 == c))

  def byFastlyCountryCode(c: String): Option[CountryGroup] =
    byCountryCode(c) orElse Some(CountryGroup.Europe).filter(_ => c == "EU")

  def byCountryNameOrCode(str: String): Option[CountryGroup] =
    allGroups.find(_.countries.exists(_.name == str)) orElse byCountryCode(str)

  def byId(id: String): Option[CountryGroup] = allGroups.find(_.id == id)

  def byName(name: String): Option[CountryGroup] = allGroups.find(_.name == name)

  def availableCurrency(currencies: Set[Currency])(country: Country): Option[Currency] =
    byCountryCode(country.alpha2).map(_.currency).filter(currencies)

  def byOptimisticCountryNameOrCode(str: String): Option[Country] = {
    if (str == null) None
    else {
      val clean = str.replace(".", "").trim
      val name = clean.toLowerCase
      val nameAnd = name.replace(" & ", " and ")
      val nameAmpersand = name.replace(" and ", " & ")

      countryByCode(clean) orElse countryByName(name) orElse countryByName(nameAnd) orElse countryByName(
        nameAmpersand,
      ) orElse (name match {
        case _ if name equals "united states of america" => Some(Country.US)
        case _ if name endsWith "of ireland" => Some(Country.Ireland)
        case _ if name == "uk" => Some(Country.UK)
        case _ if name == "great britain" => Some(Country.UK)
        case _ if name == "viet nam" => countryByCode("VN")
        case _ if name startsWith "the " => countryByName(name.replaceFirst("the ", ""))
        case _ if name == "russian federation" => countryByCode("RU")
        case _ => None
      })
    }
  }

}
