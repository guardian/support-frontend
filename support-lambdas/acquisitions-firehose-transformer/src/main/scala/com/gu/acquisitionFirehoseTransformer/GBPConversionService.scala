package com.gu.acquisitionFirehoseTransformer


import com.gu.i18n.Currency
import org.joda.time.DateTime
import org.joda.time.format.ISODateTimeFormat
import org.scanamo.generic.auto._
import org.scanamo.syntax._
import org.scanamo.{Scanamo, Table}
import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, EnvironmentVariableCredentialsProvider, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.dynamodb.DynamoDbClient

trait GBPConversionService {
  def convert(currency: Currency, amount: Double, dateTime: DateTime): Either[String,Double]
}

object GBPConversionServiceImpl extends GBPConversionService {
  private case class ConversionData(base: String, eventDate: String, rates: Map[String,Float])

  val chain = AwsCredentialsProviderChain.builder()
    .addCredentialsProvider(EnvironmentVariableCredentialsProvider.create())
    .addCredentialsProvider(ProfileCredentialsProvider.create("membership"))
    .addCredentialsProvider(ProfileCredentialsProvider.create())
    .addCredentialsProvider(InstanceProfileCredentialsProvider.create())
    .build()

  val dynamoDb = DynamoDbClient.builder()
    .credentialsProvider(chain)
    .region(Region.EU_WEST_1)
    .build()

//  private val dynamoDb = DynamoDbClient.builder().region(Region.EU_WEST_1).endpointDiscoveryEnabled(true).build()
  private val scanamo: Scanamo = Scanamo(dynamoDb)
  private val table: Table[ConversionData] = Table("fixer-io-cache")

  def convert(currency: Currency, amount: Double, dateTime: DateTime): Either[String,Double] = {
    val date = ISODateTimeFormat.date().print(dateTime)
    scanamo
      .exec(
        table.query("eventDate" === date and ("base" === "GBP"))
      )
      .headOption.toRight(s"No results found in dynamodb for $date")
      .flatMap {
        case Right(conversionData) =>
          conversionData.rates.get(currency.iso) match {
            case Some(rate) => Right(amount / rate)
            case None => Left(s"Cannot find rate for currency ${currency.iso}")
          }
        case Left(error) => Left(error.toString)
      }
  }
}
