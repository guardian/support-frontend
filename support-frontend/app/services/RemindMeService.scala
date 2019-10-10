package services

import com.amazonaws.regions.Regions
import com.amazonaws.services.lambda.AWSLambdaClientBuilder
import com.amazonaws.services.lambda.model.InvokeRequest
import com.gu.monitoring.SafeLogger
import com.gu.support.config.{Stage, Stages}
import play.api.libs.json.Json

import scala.concurrent.{ExecutionContext, Future}

class RemindMeService(stage: Stage) {

  private val lambdaClient = AWSLambdaClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1.getName)
    .withCredentials(aws.CredentialsProvider)
    .build()

  private val functionName = stage match {
    case Stages.PROD => "contributions-reminders-lambda-PROD"
    case _ => "contributions-reminders-lambda-CODE"
  }

  private val expectedResponse = """{"statusCode":200,"body":"\"OK\""}"""

  def apply(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {

    val emailJson = Json.obj("email" -> email)
    val payload = Json.obj("ReminderCreatedEvent" -> emailJson)

    val request = new InvokeRequest()
      .withFunctionName(functionName)
      .withPayload(payload.toString)

    val res = lambdaClient.invoke(request)
    val responseBody = new String(res.getPayload.array())
    val isSuccessResponse = responseBody == expectedResponse

    if (!isSuccessResponse) SafeLogger.warn(s"Got ${responseBody} for ${res.getSdkHttpMetadata}")

    Future(isSuccessResponse)
  }

}
