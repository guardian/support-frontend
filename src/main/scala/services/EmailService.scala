package services

import aws.AWSClientBuilder
import cats.data.{EitherT, Validated}
import cats.implicits._
import com.amazonaws.services.sqs.model.{SendMessageRequest, _}
import com.amazonaws.services.sqs.AmazonSQSAsync
import com.paypal.api.payments.{PayerInfo, Payment}
import com.typesafe.scalalogging.StrictLogging
import conf.EmailConfig
import model.email.ContributorRow
import model.{DefaultThreadPool, InitializationError, InitializationResult}

import scala.collection.JavaConverters._
import scala.concurrent.Future

class EmailService(sqsClient: AmazonSQSAsync, queueName: String)(implicit pool: DefaultThreadPool) extends StrictLogging {

  val thankYouQueueUrl = sqsClient.getQueueUrl(queueName).getQueueUrl

  def sendPaypalThankEmail(payment: Payment, cmp: Option[Set[String]]):
  EitherT[Future, Throwable, SendMessageResult] = {
    for {
      row <- buildContributorRow(payment, cmp.map(_.toString))
      emailResult <- sendEmailToQueue(thankYouQueueUrl, row)
    } yield emailResult
  }

  /*
   * No need to provide an AsyncHandler as the process is fire and forget and it's not required any action if the message
   * cannot be process by the subscriber.
   */
  private def sendEmailToQueue(queueUrl: String, row: ContributorRow):
  EitherT[Future, Throwable, SendMessageResult] = {
    EitherT(Future {
      sqsClient.sendMessageAsync(new SendMessageRequest(queueUrl, row.toJsonContributorRowSqsMessage)).get
    }.map(Right.apply).recover {
      case err: Throwable => Left(err)
      case _ => Left(new Exception("Unknown error while sending message to SQS."))
    })
  }

  private def fullName(payerInfo: PayerInfo): Option[String] = {
    val firstName = Option(payerInfo.getFirstName)
    val lastName = Option(payerInfo.getLastName)
    Seq(firstName, lastName).flatten match {
      case Nil => None
      case names => Some(names.mkString(" "))
    }
  }

  private def buildContributorRow(payment: Payment, cmp: Option[String]):
  EitherT[Future, Throwable, ContributorRow] = Either.catchNonFatal {
    val transaction = payment.getTransactions.asScala.head
    ContributorRow(
      email = payment.getPayer.getPayerInfo.getEmail,
      created = payment.getCreateTime,
      amount = BigDecimal(transaction.getAmount.getTotal),
      currency = transaction.getAmount.getCurrency,
      name = fullName(payment.getPayer.getPayerInfo).getOrElse(""),
      cmp = cmp
    )
  }.toEitherT[Future]
}

object EmailService {
  def fromEmailConfig(config: EmailConfig)(implicit pool: DefaultThreadPool): InitializationResult[EmailService] = {
    Validated.catchNonFatal {
      new EmailService(AWSClientBuilder.buildAmazonSQSAsyncClientBuilder(config.queueName), config.queueName)
    }.leftMap { err =>
      InitializationError(s"unable to instantiate EmailService for config: ${config}. Error trace: ${err.getMessage}")
    }
  }
}