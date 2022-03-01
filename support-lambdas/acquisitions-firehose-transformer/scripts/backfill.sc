import scala.io.Source

case class BigQueryItem(
    paymentFrequency: String,
    countryCode: String,
    amount: String,
    currency: String,
    eventTimestamp: String,
    campaignCodes: String,
    componentId: String,
    product: String,
    paymentProvider: String,
    referrerUrl: String,
    annualisedValue: String,
    annualisedValueInGBP: String,
    labels: String,
)

def toJson(item: BigQueryItem): String = {
  s"""
     |{
     |  "paymentFrequency": "${item.paymentFrequency}",
     |  "countryCode": "${item.countryCode}",
     |  "amount": ${item.amount},
     |  "annualisedValue": ${item.annualisedValue},
     |  "annualisedValueGBP": ${item.annualisedValueInGBP},
     |  "currency": "${item.currency}",
     |  "timestamp": "${item.eventTimestamp}",
     |  "campaignCode": "${item.campaignCodes}",
     |  "componentId": "${item.componentId}",
     |  "product": "${item.product}",
     |  "paymentProvider": "${item.paymentProvider}",
     |  "referrerUrl": "${item.referrerUrl}",
     |  "labels": ${item.labels}
     |}
     |""".stripMargin.replaceAll("\n", "")
}

def parseLine(line: String): Option[BigQueryItem] = {
  line.split(",").toList match {
    case pf :: cc :: amount :: ccy :: ts :: campaignCodes :: componentId :: product :: pp :: ref :: av :: avgbp :: labels :: Nil =>
      val timestamp = ts.replaceAll("T", " ").take(19)
      val campaignCode = campaignCodes.replaceAll("""[\[\]]""", "")
      Some(
        BigQueryItem(
          pf,
          cc,
          amount,
          ccy,
          timestamp,
          campaignCode,
          componentId,
          product,
          pp,
          ref,
          av,
          avgbp,
          labels,
        ),
      )
    case other =>
      println(s"Ignoring $other")
      None
  }
}

def readLines(path: String): List[String] = {
  val source = Source.fromFile(path)
  val lines = source.getLines().toList
  source.close()
  lines
}

@main
def main(path: String) = {
  readLines(path)
    .map(parseLine)
    .flatten
    .map(toJson)
    .foreach(println)
}
