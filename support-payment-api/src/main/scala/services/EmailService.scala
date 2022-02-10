package services

import aws.AWSClientBuilder
import cats.data.{EitherT, Validated}
import com.amazonaws.services.sqs.AmazonSQSAsync
import com.amazonaws.services.sqs.model.{SendMessageRequest, _}
import com.typesafe.scalalogging.StrictLogging
import conf.EmailConfig
import model.email.ContributorRow
import model.{DefaultThreadPool, InitializationError, InitializationResult}

import scala.concurrent.Future

class EmailService(sqsClient: AmazonSQSAsync, queueName: String)(implicit pool: DefaultThreadPool)
    extends StrictLogging {

  val thankYouQueueUrl = sqsClient.getQueueUrl(queueName).getQueueUrl

  /*
   * No need to provide an AsyncHandler as the process is fire and forget and it's not required any action if the message
   * cannot be process by the subscriber.
   */
  def sendThankYouEmail(contributorRow: ContributorRow): EitherT[Future, EmailService.Error, SendMessageResult] = {

    EitherT(Future {
      sqsClient
        .sendMessageAsync(new SendMessageRequest(thankYouQueueUrl, contributorRow.toJsonContributorRowSqsMessage))
        .get
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
