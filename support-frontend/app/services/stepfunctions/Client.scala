package services.stepfunctions

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.regions.Regions
import com.amazonaws.services.stepfunctions.model.{ExecutionStatus => _, _}
import com.amazonaws.services.stepfunctions.{AWSStepFunctionsAsync, AWSStepFunctionsAsyncClientBuilder}
import com.gu.monitoring.SafeLogging
import io.circe.Encoder
import org.apache.pekko.actor.ActorSystem
import services.aws.{AwsAsync, CredentialsProvider}
import services.stepfunctions.StateMachineContainer.{Response, convertErrors}
import services.stepfunctions.StateMachineErrors.Fail

import java.nio.ByteBuffer
import java.util.Base64
import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters._

object Client {

  def apply(arn: StateMachineArn)(implicit system: ActorSystem): Client = {
    implicit val ec = system.dispatcher

    val client = AWSStepFunctionsAsyncClientBuilder.standard
      .withCredentials(CredentialsProvider)
      .withRegion(Regions.EU_WEST_1)
      .build()

    new Client(client, arn)
  }

  def generateExecutionName(name: String, l: Long = System.nanoTime()) = {
    val uniq = {
      val bytes = ByteBuffer.allocate(8).putLong(l).array()
      val encodedString = Base64.getEncoder.encodeToString(bytes)
      encodedString.replaceAll("\\+", "_").replaceAll("/", "_").replaceAll("=", "")
    }
    val freeCharacters = 80 - name.length - 1 - uniq.length
    val validName =
      if (freeCharacters >= 0)
        name + "-" + uniq
      else {
        val truncatedName = name.take(80 - 1 - uniq.length - 2)
        truncatedName + "-" + uniq + "--"
      }
    validName
  }

}

class Client(client: AWSStepFunctionsAsync, arn: StateMachineArn) extends SafeLogging {

  private def startExecution(arn: String, input: String, name: String)(implicit
      ec: ExecutionContext,
  ): Response[StartExecutionResult] = convertErrors {
    val startExecutionRequest =
      new StartExecutionRequest()
        .withStateMachineArn(arn)
        .withInput(input)
        .withName(Client.generateExecutionName(name))
    AwsAsync(client.startExecutionAsync, startExecutionRequest)
      .transform { theTry =>
        logger.info(s"state machine result: $theTry")
        theTry
      }
  }

  def triggerExecution[T](input: T, isTestUser: Boolean, name: String)(implicit
      ec: ExecutionContext,
      encoder: Encoder[T],
      stateWrapper: StateWrapper,
  ): Response[StateMachineExecution] = {
    startExecution(arn.asString, stateWrapper.wrap(input, isTestUser), name)
      .map(StateMachineExecution.fromStartExecution)
  }

  def jobIdFromArn(executionArn: String): Option[String] = {
    val region = arn.region
    val accountId = arn.accountId
    val stateMachineId = arn.id

    PartialFunction.condOpt(executionArn.split(':').toList) {
      case "arn" :: "aws" :: "states" :: `region` :: `accountId` :: "execution" :: `stateMachineId` :: executionId :: Nil =>
        executionId
    }
  }

  def arnFromJobId(jobId: String): String =
    s"arn:aws:states:${arn.region}:${arn.accountId}:execution:${arn.id}:${convertLegacyJobId(jobId)}"

  private def convertLegacyJobId(legacyJobId: String): String = legacyJobId.split(':').toList match {
    case _ :: id :: Nil => id
    case _ => legacyJobId
  }

  def statusFromEvents(events: List[HistoryEvent]): Option[ExecutionStatus] =
    events.view.map(_.getType).collectFirst(ExecutionStatus.all)

  def history(
      jobId: String,
  )(implicit ec: ExecutionContext, stateWrapper: StateWrapper): Response[List[HistoryEvent]] = {
    toEither(
      AwsAsync(
        client.getExecutionHistoryAsync,
        new GetExecutionHistoryRequest().withExecutionArn(arnFromJobId(jobId)).withReverseOrder(true),
      ),
    ).map(_.getEvents.asScala.toList)
  }

  private def toEither[T](result: Future[T])(implicit ec: ExecutionContext): Response[T] = EitherT {
    result.map(_.asRight[StateMachineError]).recover { case _: AWSStepFunctionsException =>
      Fail.asLeft
    }
  }

  def status()(implicit ec: ExecutionContext): Response[DescribeStateMachineResult] = convertErrors {
    AwsAsync(client.describeStateMachineAsync, new DescribeStateMachineRequest().withStateMachineArn(arn.asString))
  }
}
