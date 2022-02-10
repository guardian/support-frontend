package services

import aws.AWSClientBuilder
import cats.data.{EitherT, Validated}
import com.amazonaws.services.sqs.AmazonSQSAsync
import com.amazonaws.services.sqs.model.{MessageAttributeValue, SendMessageRequest}
import com.typesafe.scalalogging.StrictLogging
import conf.ContributionsStoreQueueConfig
import io.circe.syntax._
import io.circe.{Encoder, Json}
import model.db.ContributionData
import model.{InitializationError, InitializationResult, SQSThreadPool}
import services.ContributionsStoreQueueService.Message

import java.time.LocalDateTime
import scala.collection.JavaConverters._
import scala.concurrent.Future
import scala.util.control.NonFatal

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
  def fromContributionsStoreQueueConfig(
      config: ContributionsStoreQueueConfig,
  )(implicit pool: SQSThreadPool): InitializationResult[ContributionsStoreQueueService] = {
    Validated
      .catchNonFatal {
        new ContributionsStoreQueueService(config.queueUrl, config.keyId)
      }
      .leftMap { err =>
        InitializationError(
          s"unable to instantiate ContributionsStoreQueueService for config: $config. Error trace: ${err.getMessage}",
        )
      }
  }

  sealed trait Message

  case class NewContributionData(contributionData: ContributionData) extends Message

  case class RefundedPaymentId(paymentId: String) extends Message

  object Message {
    private implicit val messageEncoder = Encoder[Message] { message =>
      import io.circe.generic.auto._

      // copied from earlier version of circe-core to prevent seconds appearing in the serialised form
      implicit val encodeLocalDateTime: Encoder[LocalDateTime] = (a: LocalDateTime) => Json.fromString(a.toString)

      Json.obj {
        message match {
          case NewContributionData(contributionData) =>
            "newContributionData" -> cleanSubdivisionCode(contributionData).asJson
          case RefundedPaymentId(paymentId) =>
            "refundedPaymentId" -> Json.fromString(paymentId)
        }
      }
    }

    def toJson(message: Message): Json = message.asJson
  }

  private def cleanSubdivisionCode(data: ContributionData) =
    data.copy(countrySubdivisionCode =
      data.countrySubdivisionCode
        .map(subdivisionCode =>
          subdivisionCode
            .filter(c => c.isLetterOrDigit || c.isWhitespace)
            .replaceAll("[\n\r]", "")
            .trim,
        ),
    )
}

class ContributionsStoreQueueService(queueUrl: String, keyId: String, region: String = "eu-west-1")(implicit
    pool: SQSThreadPool,
) extends ContributionsStoreService
    with StrictLogging {

  private object SqsService {

    private val sqsClient: AmazonSQSAsync = AWSClientBuilder
      .buildAmazonSQSAsyncClient()

    private val messageAttributes = Map(
      "keyId" -> new MessageAttributeValue().withStringValue(keyId).withDataType("String"),
    )

    def publish(message: String): EitherT[Future, ContributionsStoreService.Error, Unit] = EitherT {
      Future {
        val request = new SendMessageRequest()
          .withQueueUrl(queueUrl)
          .withMessageBody(message)
          .withMessageAttributes(messageAttributes.asJava)

        sqsClient.sendMessage(request) // Sync API of Async client
      }
        .map(_ => Right.apply(()))
        .recover { case NonFatal(e) =>
          // The tabs make CloudWatch group the log lines together
          logger.error(s"Failed to publish to contributions-store-queue.\n\tError was $e.\n\tMessage was: $message")
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
