package services

import cats.data.{EitherT, Validated}
import io.circe.syntax._
import io.circe.{Encoder, Json}
import com.amazonaws.ClientConfiguration
import com.amazonaws.services.sqs.model.{MessageAttributeValue, SendMessageRequest}
import com.amazonaws.services.sqs.{AmazonSQS, AmazonSQSClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import conf.ContributionsStoreQueueConfig

import scala.concurrent.Future
import model.{InitializationError, InitializationResult, SQSThreadPool}
import model.db.ContributionData
import services.ContributionsStoreQueueService.Message

import scala.util.control.NonFatal
import scala.collection.JavaConverters._


trait ContributionsStoreService {

  // If an insert is unsuccessful then an error should be logged, however,
  // the return type is not modelled as an EitherT,
  // since the result of the insert has no dependencies.
  // See e.g. backend.StripeBackend for more context.
  def insertContributionData(data: ContributionData): EitherT[Future, ContributionsStoreService.Error, Unit]
  def flagContributionAsRefunded(paymentId: String): EitherT[Future, ContributionsStoreService.Error, Unit]
}

object ContributionsStoreService {
  case class Error(err: Throwable) extends Exception {
    override def getMessage: String = err.getMessage
  }
}

object ContributionsStoreQueueService {
  def fromContributionsStoreQueueConfig(config: ContributionsStoreQueueConfig)(implicit pool: SQSThreadPool): InitializationResult[ContributionsStoreQueueService] = {
    Validated.catchNonFatal {
      new ContributionsStoreQueueService(config.queueUrl, config.keyId)
    }.leftMap { err =>
      InitializationError(s"unable to instantiate ContributionsStoreQueueService for config: $config. Error trace: ${err.getMessage}")
    }
  }

  sealed trait Message
  case class NewContributionData(contributionData: ContributionData) extends Message
  case class RefundedPaymentId(paymentId: String) extends Message

  object Message {
    private implicit val messageEncoder = Encoder[Message] { message =>
      import io.circe.generic.auto._

      Json.obj {
        message match {
          case NewContributionData(contributionData) => "newContributionData" -> contributionData.asJson
          case RefundedPaymentId(paymentId) => "refundedPaymentId" -> Json.fromString(paymentId)
        }
      }
    }

    def toJson(message: Message): Json = message.asJson
  }
}

class ContributionsStoreQueueService(queueUrl: String, keyId: String, region: String = "eu-west-1")(implicit pool: SQSThreadPool)
  extends ContributionsStoreService with StrictLogging {

  private object SqsService {

    private val sqsClient: AmazonSQS = {
      AmazonSQSClientBuilder.standard
        .withClientConfiguration(new ClientConfiguration())
        .withRegion(region)
        .build
    }

    private val messageAttributes = Map(
      "keyId" -> new MessageAttributeValue().withStringValue(keyId).withDataType("String")
    )

    def publish(message: String): EitherT[Future, ContributionsStoreService.Error, Unit] = EitherT {
      Future {
        val request = new SendMessageRequest()
          .withQueueUrl(queueUrl)
          .withMessageBody(message)
          .withMessageAttributes(messageAttributes.asJava)

        sqsClient.sendMessage(request)
      }
        .map(_ => Right.apply(()))
        .recover {
          case NonFatal(e) =>
            logger.error(s"Failed to publish update to SQS.\nError was $e.\nMessage was: $message")
            Left(ContributionsStoreService.Error(e))
        }
    }
  }

  override def insertContributionData(data: ContributionData): EitherT[Future, ContributionsStoreService.Error, Unit] =
    SqsService.publish {
      Message.toJson(ContributionsStoreQueueService.NewContributionData(data)).noSpaces
    }

  override def flagContributionAsRefunded(paymentId: String): EitherT[Future, ContributionsStoreService.Error, Unit] =
    SqsService.publish {
      Message.toJson(ContributionsStoreQueueService.RefundedPaymentId(paymentId)).noSpaces
    }
}
