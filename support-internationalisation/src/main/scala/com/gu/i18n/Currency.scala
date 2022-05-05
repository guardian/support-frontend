package com.gu.i18n

sealed trait Currency {
  def prefix: Option[String] = None
  def glyph: String
  def identifier: String = prefix.getOrElse("") + glyph
  def iso: String
}

object Currency {
  val all = List(
    GBP,
    USD,
    AUD,
    CAD,
    EUR,
    NZD,
    SEK,
    CHF,
    NOK,
    DKK,
    AFN,
    ALL,
    DZD,
    AOA,
    XCD,
    ARS,
    AMD,
    AWG,
    AZN,
    BSD,
    BHD,
    BDT,
    BBD,
    BYN,
    BZD,
    BMD,
    BTN,
    BOB,
    BOV,
    BES,
    BAM,
    BWP,
    BRL,
    BND,
    BGN,
    BIF,
    CVE,
    KHR,
    KYD,
    XAF,
    CLP,
    CNY,
    COP,
    KMF,
    CDF,
    CRC,
    HRK,
    CUP,
    CZK,
    DJF,
    DOP,
    EGP,
    ERN,
    ETB,
    FKP,
    FJD,
    XPF,
    GMD,
    GEL,
    GHS,
    GIP,
    GTQ,
    GNF,
    GYD,
    HTG,
    HNL,
    HKD,
    HUF,
    ISK,
    INR,
    IDR,
    IRR,
    IQD,
    ILS,
    JMD,
    JPY,
    JOD,
    KZT,
    KES,
    KPW,
    KRW,
    KWD,
    KGS,
    LAK,
    LBP,
    LSL,
    LRD,
    LYD,
    MOP,
    MGA,
    MWK,
    MYR,
    MVR,
    MRU,
    MUR,
    MXN,
    MXV,
    MDL,
    MNT,
    MAD,
    MZN,
    MMK,
    NAD,
    NPR,
    NIO,
    NGN,
    OMR,
    PKR,
    PAB,
    PGK,
    PYG,
    PEN,
    PHP,
    PLN,
    QAR,
    MKD,
    RON,
    RUB,
    RWF,
    SHP,
    WST,
    STN,
    SAR,
    RSD,
    SCR,
    SLL,
    SGD,
    ANG,
    SBD,
    SOS,
    ZAR,
    SSP,
    LKR,
    SDG,
    SRD,
    SZL,
    SYP,
    TWD,
    TJS,
    TZS,
    THB,
    XOF,
    TOP,
    TTD,
    TND,
    TRY,
    TMT,
    UGX,
    UAH,
    AED,
    UYU,
    UZS,
    VUV,
    VEF,
    VND,
    YER,
    ZMW,
    ZWL,
  )

  def fromString(s: String): Option[Currency] = all.find(_.iso == s)

  case object GBP extends Currency {
    override def glyph: String = "£"
    override def iso: String = "GBP"
  }
  case object USD extends Currency {
    override def glyph: String = "$"
    override def prefix: Option[String] = Some("US")
    override def iso: String = "USD"
  }
  case object AUD extends Currency {
    override def glyph: String = "$"
    override def prefix: Option[String] = Some("AU")
    override def iso: String = "AUD"
  }
  case object CAD extends Currency {
    override def glyph: String = "$"
    override def prefix: Option[String] = Some("CA")
    override def iso: String = "CAD"
  }
  case object EUR extends Currency {
    override def glyph: String = "€"
    override def iso: String = "EUR"
  }
  case object NZD extends Currency {
    override def glyph: String = "$"
    override def prefix: Option[String] = Some("NZ")
    override def iso: String = "NZD"
  }
  case object SEK extends Currency {
    override def glyph: String = "kr"
    override def prefix: Option[String] = Some("SE")
    override def iso: String = "SEK"
  }
  case object CHF extends Currency {
    override def glyph: String = "fr."
    override def prefix: Option[String] = Some("CH")
    override def iso: String = "CHF"
  }
  case object NOK extends Currency {
    override def glyph: String = "kr"
    override def prefix: Option[String] = Some("NO")
    override def iso: String = "NOK"
  }
  case object DKK extends Currency {
    override def glyph: String = "kr."
    override def prefix: Option[String] = Some("DK")
    override def iso: String = "DKK"
  }
  case object AFN extends Currency {
    override def glyph: String = "؋"
    override def iso: String = "AFN"
  }
  case object ALL extends Currency {
    override def glyph: String = "Lek"
    override def iso: String = "ALL"
  }
  case object DZD extends Currency {
    override def glyph: String = "د.ج"
    override def iso: String = "DZD"
  }
  case object AOA extends Currency {
    override def glyph: String = "is"
    override def iso: String = "AOA"
  }
  case object XCD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "XCD"
  }
  case object ARS extends Currency {
    override def glyph: String = "$"
    override def iso: String = "ARS"
  }
  case object AMD extends Currency {
    override def glyph: String = "Դ"
    override def iso: String = "AMD"
  }
  case object AWG extends Currency {
    override def glyph: String = "ƒ"
    override def iso: String = "AWG"
  }
  case object AZN extends Currency {
    override def glyph: String = "₼"
    override def iso: String = "AZN"
  }
  case object BSD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "BSD"
  }
  case object BHD extends Currency {
    override def glyph: String = "ب.د"
    override def iso: String = "BHD"
  }
  case object BDT extends Currency {
    override def glyph: String = "৳"
    override def iso: String = "BDT"
  }
  case object BBD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "BBD"
  }
  case object BYN extends Currency {
    override def glyph: String = "p."
    override def iso: String = "BYN"
  }
  case object BZD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "BZD"
  }
  case object BMD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "BMD"
  }
  case object BTN extends Currency {
    override def glyph: String = ""
    override def iso: String = "BTN"
  }
  case object BOB extends Currency {
    override def glyph: String = "Bs."
    override def iso: String = "BOB"
  }
  case object BOV extends Currency {
    override def glyph: String = "Mvdol"
    override def iso: String = "BOV"
  }
  case object BES extends Currency {
    override def glyph: String = "$"
    override def iso: String = "BES"
  }
  case object BAM extends Currency {
    override def glyph: String = "КМ"
    override def iso: String = "BAM"
  }
  case object BWP extends Currency {
    override def glyph: String = "P"
    override def iso: String = "BWP"
  }
  case object BRL extends Currency {
    override def glyph: String = "R$"
    override def iso: String = "BRL"
  }
  case object BND extends Currency {
    override def glyph: String = "$"
    override def iso: String = "BND"
  }
  case object BGN extends Currency {
    override def glyph: String = "лв"
    override def iso: String = "BGN"
  }
  case object BIF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "BIF"
  }
  case object CVE extends Currency {
    override def glyph: String = ""
    override def iso: String = "CVE"
  }
  case object KHR extends Currency {
    override def glyph: String = "៛"
    override def iso: String = "KHR"
  }
  case object KYD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "KYD"
  }
  case object XAF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "XAF"
  }
  case object CLP extends Currency {
    override def glyph: String = "$"
    override def iso: String = "CLP"
  }
  case object CNY extends Currency {
    override def glyph: String = "¥"
    override def iso: String = "CNY"
  }
  case object COP extends Currency {
    override def glyph: String = "$"
    override def iso: String = "COP"
  }
  case object KMF extends Currency {
    override def glyph: String = ""
    override def iso: String = "KMF"
  }
  case object CDF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "CDF"
  }
  case object CRC extends Currency {
    override def glyph: String = "₡"
    override def iso: String = "CRC"
  }
  case object HRK extends Currency {
    override def glyph: String = "Kn"
    override def iso: String = "HRK"
  }
  case object CUP extends Currency {
    override def glyph: String = ""
    override def iso: String = "CUP"
  }
  case object CZK extends Currency {
    override def glyph: String = "Kč"
    override def iso: String = "CZK"
  }
  case object DJF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "DJF"
  }
  case object DOP extends Currency {
    override def glyph: String = "$"
    override def iso: String = "DOP"
  }
  case object EGP extends Currency {
    override def glyph: String = "£"
    override def iso: String = "EGP"
  }
  case object ERN extends Currency {
    override def glyph: String = "Nfk"
    override def iso: String = "ERN"
  }
  case object ETB extends Currency {
    override def glyph: String = ""
    override def iso: String = "ETB"
  }
  case object FKP extends Currency {
    override def glyph: String = "£"
    override def iso: String = "FKP"
  }
  case object FJD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "FJD"
  }
  case object XPF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "XPF"
  }
  case object GMD extends Currency {
    override def glyph: String = "D"
    override def iso: String = "GMD"
  }
  case object GEL extends Currency {
    override def glyph: String = "ლ"
    override def iso: String = "GEL"
  }
  case object GHS extends Currency {
    override def glyph: String = "₵"
    override def iso: String = "GHS"
  }
  case object GIP extends Currency {
    override def glyph: String = "£"
    override def iso: String = "GIP"
  }
  case object GTQ extends Currency {
    override def glyph: String = "Q"
    override def iso: String = "GTQ"
  }
  case object GNF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "GNF"
  }
  case object GYD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "GYD"
  }
  case object HTG extends Currency {
    override def glyph: String = "G"
    override def iso: String = "HTG"
  }
  case object HNL extends Currency {
    override def glyph: String = "L"
    override def iso: String = "HNL"
  }
  case object HKD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "HKD"
  }
  case object HUF extends Currency {
    override def glyph: String = "Ft"
    override def iso: String = "HUF"
  }
  case object ISK extends Currency {
    override def glyph: String = "Kr"
    override def iso: String = "ISK"
  }
  case object INR extends Currency {
    override def glyph: String = "₨"
    override def iso: String = "INR"
  }
  case object IDR extends Currency {
    override def glyph: String = "Rp"
    override def iso: String = "IDR"
  }
  case object IRR extends Currency {
    override def glyph: String = "﷼"
    override def iso: String = "IRR"
  }
  case object IQD extends Currency {
    override def glyph: String = "ع.د"
    override def iso: String = "IQD"
  }
  case object ILS extends Currency {
    override def glyph: String = "₪"
    override def iso: String = "ILS"
  }
  case object JMD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "JMD"
  }
  case object JPY extends Currency {
    override def glyph: String = "¥"
    override def iso: String = "JPY"
  }
  case object JOD extends Currency {
    override def glyph: String = "د.ا"
    override def iso: String = "JOD"
  }
  case object KZT extends Currency {
    override def glyph: String = "〒"
    override def iso: String = "KZT"
  }
  case object KES extends Currency {
    override def glyph: String = "Sh"
    override def iso: String = "KES"
  }
  case object KPW extends Currency {
    override def glyph: String = ""
    override def iso: String = "KPW"
  }
  case object KRW extends Currency {
    override def glyph: String = ""
    override def iso: String = "KRW"
  }
  case object KWD extends Currency {
    override def glyph: String = "د.ك"
    override def iso: String = "KWD"
  }
  case object KGS extends Currency {
    override def glyph: String = ""
    override def iso: String = "KGS"
  }
  case object LAK extends Currency {
    override def glyph: String = ""
    override def iso: String = "LAK"
  }
  case object LBP extends Currency {
    override def glyph: String = "ل.ل"
    override def iso: String = "LBP"
  }
  case object LSL extends Currency {
    override def glyph: String = "L"
    override def iso: String = "LSL"
  }
  case object LRD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "LRD"
  }
  case object LYD extends Currency {
    override def glyph: String = "ل.د"
    override def iso: String = "LYD"
  }
  case object MOP extends Currency {
    override def glyph: String = "P"
    override def iso: String = "MOP"
  }
  case object MGA extends Currency {
    override def glyph: String = "MK"
    override def iso: String = "MGA"
  }
  case object MWK extends Currency {
    override def glyph: String = ""
    override def iso: String = "MWK"
  }
  case object MYR extends Currency {
    override def glyph: String = "RM"
    override def iso: String = "MYR"
  }
  case object MVR extends Currency {
    override def glyph: String = "ރ"
    override def iso: String = "MVR"
  }
  case object MRU extends Currency {
    override def glyph: String = "UM"
    override def iso: String = "MRU"
  }
  case object MUR extends Currency {
    override def glyph: String = "₨"
    override def iso: String = "MUR"
  }
  case object MXN extends Currency {
    override def glyph: String = "$"
    override def iso: String = "MXN"
  }
  case object MXV extends Currency {
    override def glyph: String = ""
    override def iso: String = "MXV"
  }
  case object MDL extends Currency {
    override def glyph: String = "L"
    override def iso: String = "MDL"
  }
  case object MNT extends Currency {
    override def glyph: String = "₮"
    override def iso: String = "MNT"
  }
  case object MAD extends Currency {
    override def glyph: String = "د.م."
    override def iso: String = "MAD"
  }
  case object MZN extends Currency {
    override def glyph: String = "MTn"
    override def iso: String = "MZN"
  }
  case object MMK extends Currency {
    override def glyph: String = "ကျပ်"
    override def iso: String = "MMK"
  }
  case object NAD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "NAD"
  }
  case object NPR extends Currency {
    override def glyph: String = "₨"
    override def iso: String = "NPR"
  }
  case object NIO extends Currency {
    override def glyph: String = "C$"
    override def iso: String = "NIO"
  }
  case object NGN extends Currency {
    override def glyph: String = "₦"
    override def iso: String = "NGN"
  }
  case object OMR extends Currency {
    override def glyph: String = ""
    override def iso: String = "OMR"
  }
  case object PKR extends Currency {
    override def glyph: String = "₨"
    override def iso: String = "PKR"
  }
  case object PAB extends Currency {
    override def glyph: String = "B/."
    override def iso: String = "PAB"
  }
  case object PGK extends Currency {
    override def glyph: String = "K"
    override def iso: String = "PGK"
  }
  case object PYG extends Currency {
    override def glyph: String = "₲"
    override def iso: String = "PYG"
  }
  case object PEN extends Currency {
    override def glyph: String = "S/."
    override def iso: String = "PEN"
  }
  case object PHP extends Currency {
    override def glyph: String = "₱"
    override def iso: String = "PHP"
  }
  case object PLN extends Currency {
    override def glyph: String = "zł"
    override def iso: String = "PLN"
  }
  case object QAR extends Currency {
    override def glyph: String = "ر.ق"
    override def iso: String = "QAR"
  }
  case object MKD extends Currency {
    override def glyph: String = ""
    override def iso: String = "MKD"
  }
  case object RON extends Currency {
    override def glyph: String = "L"
    override def iso: String = "RON"
  }
  case object RUB extends Currency {
    override def glyph: String = ""
    override def iso: String = "RUB"
  }
  case object RWF extends Currency {
    override def glyph: String = "₣"
    override def iso: String = "RWF"
  }
  case object SHP extends Currency {
    override def glyph: String = "£"
    override def iso: String = "SHP"
  }
  case object WST extends Currency {
    override def glyph: String = ""
    override def iso: String = "WST"
  }
  case object STN extends Currency {
    override def glyph: String = "Db"
    override def iso: String = "STN"
  }
  case object SAR extends Currency {
    override def glyph: String = "ر.س"
    override def iso: String = "SAR"
  }
  case object RSD extends Currency {
    override def glyph: String = "din"
    override def iso: String = "RSD"
  }
  case object SCR extends Currency {
    override def glyph: String = ""
    override def iso: String = "SCR"
  }
  case object SLL extends Currency {
    override def glyph: String = "Le"
    override def iso: String = "SLL"
  }
  case object SGD extends Currency {
    override def glyph: String = ""
    override def iso: String = "SGD"
  }
  case object ANG extends Currency {
    override def glyph: String = ""
    override def iso: String = "ANG"
  }
  case object SBD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "SBD"
  }
  case object SOS extends Currency {
    override def glyph: String = "Sh"
    override def iso: String = "SOS"
  }
  case object ZAR extends Currency {
    override def glyph: String = "R"
    override def iso: String = "ZAR"
  }
  case object SSP extends Currency {
    override def glyph: String = ""
    override def iso: String = "SSP"
  }
  case object LKR extends Currency {
    override def glyph: String = "Rs"
    override def iso: String = "LKR"
  }
  case object SDG extends Currency {
    override def glyph: String = "£"
    override def iso: String = "SDG"
  }
  case object SRD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "SRD"
  }
  case object SZL extends Currency {
    override def glyph: String = "L"
    override def iso: String = "SZL"
  }
  case object SYP extends Currency {
    override def glyph: String = ""
    override def iso: String = "SYP"
  }
  case object TWD extends Currency {
    override def glyph: String = "NT$"
    override def iso: String = "TWD"
  }
  case object TJS extends Currency {
    override def glyph: String = "ЅМ"
    override def iso: String = "TJS"
  }
  case object TZS extends Currency {
    override def glyph: String = "Sh"
    override def iso: String = "TZS"
  }
  case object THB extends Currency {
    override def glyph: String = "฿"
    override def iso: String = "THB"
  }
  case object XOF extends Currency {
    override def glyph: String = ""
    override def iso: String = "XOF"
  }
  case object TOP extends Currency {
    override def glyph: String = "T$"
    override def iso: String = "TOP"
  }
  case object TTD extends Currency {
    override def glyph: String = "$"
    override def iso: String = "TTD"
  }
  case object TND extends Currency {
    override def glyph: String = "د.ت"
    override def iso: String = "TND"
  }
  case object TRY extends Currency {
    override def glyph: String = ""
    override def iso: String = "TRY"
  }
  case object TMT extends Currency {
    override def glyph: String = "m"
    override def iso: String = "TMT"
  }
  case object UGX extends Currency {
    override def glyph: String = "Sh"
    override def iso: String = "UGX"
  }
  case object UAH extends Currency {
    override def glyph: String = "₴"
    override def iso: String = "UAH"
  }
  case object AED extends Currency {
    override def glyph: String = ""
    override def iso: String = "AED"
  }
  case object UYU extends Currency {
    override def glyph: String = "$"
    override def iso: String = "UYU"
  }
  case object UZS extends Currency {
    override def glyph: String = ""
    override def iso: String = "UZS"
  }
  case object VUV extends Currency {
    override def glyph: String = "Vt"
    override def iso: String = "VUV"
  }
  case object VEF extends Currency {
    override def glyph: String = ""
    override def iso: String = "VEF"
  }
  case object VND extends Currency {
    override def glyph: String = "₫"
    override def iso: String = "VND"
  }
  case object YER extends Currency {
    override def glyph: String = "﷼"
    override def iso: String = "YER"
  }
  case object ZMW extends Currency {
    override def glyph: String = "ZK"
    override def iso: String = "ZMW"
  }
  case object ZWL extends Currency {
    override def glyph: String = "$"
    override def iso: String = "ZWL"
  }
}
