package services

import aws.AWSClientBuilder
import backend.BackendError.SoftOptInsServiceError
import cats.data.EitherT
import cats.implicits._
import com.amazonaws.services.sqs.AmazonSQSAsync
import com.amazonaws.services.sqs.model.{GetQueueUrlRequest, SendMessageRequest}
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import io.circe.syntax.EncoderOps
import model.Environment
import model.Environment.Live
import services.SoftOptInsService.Message

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try
class SoftOptInsService(sqsClient: AmazonSQSAsync, queueUrlResponse: Future[Either[SoftOptInsServiceError, String]])
    extends StrictLogging {
  def sendMessage(
      message: Message,
  )(implicit executionContext: ExecutionContext): EitherT[Future, SoftOptInsServiceError, Unit] = {
    logger.info(s"Preparing to send message: ${message.asJson.noSpaces}")

    EitherT(queueUrlResponse).flatMap { queueUrl =>
      val request = new SendMessageRequest()
        .withQueueUrl(queueUrl)
        .withMessageBody(message.asJson.noSpaces)

      logger.info(s"Sending message to queue: $queueUrl")

      val response = Try(sqsClient.sendMessage(request)).toEither
      val responseConverted = response.left
        .map(e =>
          SoftOptInsServiceError(
            s"An error occurred sending a message to the soft opt-ins queue with message: ${e.getMessage}",
          ),
        )
        .map(_ => ())

      EitherT.fromEither[Future](responseConverted)
    }
  }
}

object SoftOptInsService extends StrictLogging {
  def apply(environment: Environment): SoftOptInsService = {
    logger.info(s"Setting up SoftOptInsService for environment: $environment")

    val sqsClient: AmazonSQSAsync = AWSClientBuilder.buildAmazonSQSAsyncClient()
    val queueName = environment match {
      case Live => "soft-opt-in-consent-setter-queue-PROD"
      case _ => "soft-opt-in-consent-setter-queue-DEV"
    }

    val queueUrlResponse: Future[Either[SoftOptInsServiceError, String]] = getQueue(sqsClient, queueName)
    new SoftOptInsService(sqsClient, queueUrlResponse)
  }

  private def getQueue(
      sqsClient: AmazonSQSAsync,
      queueName: String,
  ): Future[Either[SoftOptInsServiceError, String]] = {
    logger.info(s"Retrieving queue URL for queue name: $queueName")

    val queueUrlRequest = new GetQueueUrlRequest(queueName)
    val response = Try(sqsClient.getQueueUrl(queueUrlRequest).getQueueUrl)

    Future.successful(
      response.toEither.left.map(e =>
        SoftOptInsServiceError(
          s"An error occurred getting the queue for the SoftOptInsService with message: ${e.getMessage}",
        ),
      ),
    )
  }

  case class Message(i: String)
}
