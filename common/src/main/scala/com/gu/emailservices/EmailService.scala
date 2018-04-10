package com.gu.emailservices

import com.amazonaws.regions.Regions
import com.amazonaws.services.sqs.AmazonSQSAsyncClientBuilder
import com.amazonaws.services.sqs.model.{SendMessageRequest, SendMessageResult}
import com.gu.aws.{AwsAsync, CredentialsProvider}
import com.gu.i18n.Currency
import com.gu.support.workers.model.{DirectDebitPaymentMethod, PaymentMethod}
import com.typesafe.scalalogging.StrictLogging
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

import scala.concurrent.{ExecutionContext, Future}

case class EmailFields(
    email: String,
    created: DateTime,
    amount: BigDecimal,
    currency: Currency,
    edition: String,
    name: String,
    product: String,
    paymentMethod: Option[PaymentMethod] = None,
    directDebitMandateId: Option[String] = None
) {
  def payload(dataExtensionName: String): String =
    s"""
       |{
       |  "To": {
       |    "Address": "$email",
       |    "SubscriberKey": "$email",
       |    "ContactAttributes": {
       |      "SubscriberAttributes": {
       |        "EmailAddress": "$email",
       |        "created": "$created",
       |        "amount": $amount,
       |        "currency": "${currency.glyph}",
       |        "edition": "$edition",
       |        "name": "$name",
       |        "product": "$product"
       |        $paymentMethodJson
       |      }
       |    }
       |  },
       |  "DataExtensionName": "$dataExtensionName"
       |}
    """.stripMargin

  def paymentMethodJson: String = paymentMethod match {
    case Some(dd: DirectDebitPaymentMethod) => s"""
      ,"account name": "${dd.bankTransferAccountName}",
      "account number": "${mask(dd.bankTransferAccountNumber)}",
      "sort code": "${hyphenate(dd.bankCode)}",
      "Mandate ID": "${directDebitMandateId.getOrElse("")}",
      "first payment date": "$firstPaymentDate",
      "payment method": "Direct Debit"
     """
    case _ => ""
  }

  def firstPaymentDate: String = DateTimeFormat
    .forPattern("EEEE, d MMMM yyyy")
    .print(created.plusDays(10))

  def mask(s: String): String = s.replace(s.substring(0, 6), "******")

  def hyphenate(s: String): String = s"${s.substring(0, 2)}-${s.substring(2, 4)}-${s.substring(4, 6)}"

}

class EmailService(config: EmailConfig, implicit val executionContext: ExecutionContext) extends StrictLogging {

  private val sqsClient = AmazonSQSAsyncClientBuilder
    .standard
    .withCredentials(CredentialsProvider)
    .withRegion(Regions.EU_WEST_1)
    .build()

  private val queueUrl = sqsClient.getQueueUrl(config.queueName).getQueueUrl

  def send(fields: EmailFields): Future[SendMessageResult] = {
    logger.info(s"Sending message to SQS queue $queueUrl")
    val messageResult = AwsAsync(sqsClient.sendMessageAsync, new SendMessageRequest(queueUrl, fields.payload(config.dataExtensionName)))
    messageResult.recover {
      case throwable =>
        logger.error(s"Failed to send message due to $queueUrl due to:", throwable)
        throw throwable
    }.map { result =>
      logger.info(s"Successfully sent message to $queueUrl: $result")
      result
    }
  }

}

