package services

import aws.AWSClientBuilder
import cats.data.{EitherT, Validated}
import com.typesafe.scalalogging.StrictLogging
import conf.EmailConfig
import model.email.ContributorRow
import model.{DefaultThreadPool, InitializationError, InitializationResult}
import software.amazon.awssdk.services.sqs.SqsAsyncClient
import software.amazon.awssdk.services.sqs.model.{GetQueueUrlRequest, SendMessageRequest, SendMessageResponse}

import scala.concurrent.Future

class EmailService(sqsClient: SqsAsyncClient, queueName: String)(implicit pool: DefaultThreadPool)
    extends StrictLogging {

  val request = GetQueueUrlRequest.builder().queueName(queueName).build()
  val thankYouQueueUrl = sqsClient.getQueueUrl(request).get().queueUrl()

  /*
   * No need to provide an AsyncHandler as the process is fire and forget and it's not required any action if the message
   * cannot be process by the subscriber.
   */
  def sendThankYouEmail(contributorRow: ContributorRow): EitherT[Future, EmailService.Error, SendMessageResponse] = {
    val messageRequest = SendMessageRequest
      .builder()
      .queueUrl(thankYouQueueUrl)
      .messageBody(contributorRow.toJsonContributorRowSqsMessage)
      .build()

    EitherT(Future {
      sqsClient.sendMessage(messageRequest).get
    }.map(Right.apply).recover {
      case err: Throwable => Left(EmailService.Error(err))
      case _ => Left(EmailService.Error(new Exception("Unknown error while sending message to SQS.")))
    })
  }

}

object EmailService {
  def fromEmailConfig(config: EmailConfig)(implicit pool: DefaultThreadPool): InitializationResult[EmailService] = {
    Validated
      .catchNonFatal {
        new EmailService(AWSClientBuilder.buildAmazonSQSAsyncClient(), config.queueName)
      }
      .leftMap { err =>
        InitializationError(s"unable to instantiate EmailService for config: ${config}. Error trace: ${err.getMessage}")
      }
  }

  case class Error(err: Throwable) extends Exception {
    override def getMessage: String = err.getMessage
  }
}
