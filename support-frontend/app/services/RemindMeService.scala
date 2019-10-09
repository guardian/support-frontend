package services

import com.amazonaws.regions.Regions
import com.amazonaws.services.lambda.AWSLambdaClientBuilder
import com.amazonaws.services.lambda.model.InvokeRequest

import scala.concurrent.{ExecutionContext, Future}

class RemindMeService {

  val lambdaClient = AWSLambdaClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1.getName)
    .withCredentials(aws.CredentialsProvider)
    .build()

  def apply(email: String)(implicit ec: ExecutionContext): Future[Boolean] = {

    val functionName = "contributions-reminders-lambda-CODE"
    val payload = s"""{"ReminderCreatedEvent": {"email": "$email"}}"""

    val request = new InvokeRequest()
      .withFunctionName(functionName)
      .withPayload(payload)

    val res = lambdaClient.invoke(request)

    Future(res.getStatusCode == 200)
  }

}


