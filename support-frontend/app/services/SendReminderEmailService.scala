package services

import com.amazonaws.auth.AWSCredentialsProvider
import com.amazonaws.regions.{Region, Regions}
import com.amazonaws.services.lambda.AWSLambdaAsyncClient
import com.amazonaws.services.lambda.model.InvokeRequest
import play.api.libs.json.Json

import scala.concurrent.{ExecutionContext, Future}

class SendReminderEmailService {

  val lambdaClient = createLambdaClient(aws.CredentialsProvider)

  def apply(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {

    val functionName = "name"
    val payload = Json.obj("event" -> ("email" -> email)).toString()

    val request = new InvokeRequest()
      .withFunctionName(functionName)
      .withPayload(payload)

    val res = lambdaClient.invoke(request)

    Future(res.getStatusCode == 200)
  }

  val region = Region.getRegion(Regions.EU_WEST_1)

  def createLambdaClient(creds: AWSCredentialsProvider): AWSLambdaAsyncClient = {
    aws.CredentialsProvider.getCredentials
    region.createClient(classOf[AWSLambdaAsyncClient], creds, null)
  }

}


