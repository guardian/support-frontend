package services

import aws.AWSClientBuilder
import backend.BackendError.SingleContributionSalesforceWritesServiceError
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.AmazonSQSAsync
import com.amazonaws.services.sqs.model.{GetQueueUrlRequest, SendMessageRequest}
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import io.circe.syntax.EncoderOps
import model.db.ContributionData
import model.Environment
import model.Environment.Live
import services.SingleContributionSalesforceWritesService.Message

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
class SingleContributionSalesforceWritesService(
    sqsClient: AmazonSQSAsync,
    queueUrlResponse: Future[Either[SingleContributionSalesforceWritesServiceError, String]],
) extends StrictLogging {
  def sendMessage(
      contributionData: ContributionData,
  )(implicit
      executionContext: ExecutionContext,
  ): EitherT[Future, SingleContributionSalesforceWritesServiceError, Unit] = {
    val message = Message(
      contributionData = contributionData,
    )

    logger.info(s"Preparing to send message: ${message.asJson.noSpaces}")

    for {
      queueUrl <- EitherT(queueUrlResponse)
      _ <- sendRequest(queueUrl, message)
    } yield ()
  }

  private def sendRequest(queueUrl: String, message: Message)(implicit
      executionContext: ExecutionContext,
  ): EitherT[Future, SingleContributionSalesforceWritesServiceError, Unit] = {
    val request = new SendMessageRequest()
      .withQueueUrl(queueUrl)
      .withMessageBody(message.asJson.noSpaces)

    logger.info(s"Sending message to queue: $queueUrl")

    val response = Try(sqsClient.sendMessage(request)).toEither
    val responseConverted = response.left
      .map(e =>
        SingleContributionSalesforceWritesServiceError(
          s"An error occurred sending a message to the single contribution salesforce writes queue with message: ${e.getMessage}",
        ),
      )
      .map(_ => ())

    EitherT.fromEither[Future](responseConverted)
  }
}

object SingleContributionSalesforceWritesService extends StrictLogging {
  def apply(environment: Environment): SingleContributionSalesforceWritesService = {
    logger.info(s"Setting up SingleContributionSalesforceWritesService for environment: $environment")

    val sqsClient: AmazonSQSAsync = AWSClientBuilder.buildAmazonSQSAsyncClient()
    val queueName = environment match {
      case Live => "single-contribution-salesforce-writes-queue-PROD"
      case _ => "single-contribution-salesforce-writes-queue-CODE"
    }

    val queueUrlResponse: Future[Either[SingleContributionSalesforceWritesServiceError, String]] =
      getQueue(sqsClient, queueName)
    new SingleContributionSalesforceWritesService(sqsClient, queueUrlResponse)
  }

  private def getQueue(
      sqsClient: AmazonSQSAsync,
      queueName: String,
  ): Future[Either[SingleContributionSalesforceWritesServiceError, String]] = {
    logger.info(s"Retrieving queue URL for queue name: $queueName")

    val queueUrlRequest = new GetQueueUrlRequest(queueName)
    val response = Try(sqsClient.getQueueUrl(queueUrlRequest).getQueueUrl)

    Future.successful(
      response.toEither.left.map(e =>
        SingleContributionSalesforceWritesServiceError(
          s"An error occurred getting the queue for the SingleContributionSalesforceWritesService with message: ${e.getMessage}",
        ),
      ),
    )
  }

  case class Message(
      contributionData: ContributionData,
  )
}
