package services

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.regions.Regions
import com.amazonaws.services.lambda.AWSLambdaClientBuilder
import com.amazonaws.services.lambda.model.InvokeRequest
import com.gu.support.config.{Stage, Stages}
import com.typesafe.scalalogging.StrictLogging
import io.circe.parser.decode
import io.circe.{Decoder, Encoder, Json}

import scala.concurrent.{ExecutionContext, Future}

case class LambdaResponse(body: String)
object LambdaResponse {
  import io.circe.generic.auto._
  implicit val decoder: Decoder[LambdaResponse] = Decoder[LambdaResponse]
}

case class SetupIntent(client_secret: String)
object SetupIntent {
  import io.circe.generic.auto._
  implicit val decoder: Decoder[SetupIntent] = Decoder[SetupIntent]
  implicit val encoder: Encoder[SetupIntent] = Encoder[SetupIntent]
}

class StripeSetupIntentService(stage: Stage)(implicit ec: ExecutionContext) extends StrictLogging {

  import SetupIntent.decoder

  private val lambdaClient = AWSLambdaClientBuilder
    .standard()
    .withRegion(Regions.EU_WEST_1.getName)
    .withCredentials(aws.CredentialsProvider)
    .build()

  private val functionName = stage match {
    case Stages.PROD => "stripe-intent-PROD"
    case _ => "stripe-intent-CODE"
  }

  def apply(publicKey: String)(implicit ec: ExecutionContext): EitherT[Future, String, SetupIntent] = {
    val request = new InvokeRequest()
      .withFunctionName(functionName)
      .withPayload(
        // The lambda expects the input to have the format used by API Gateway
        Json
          .fromFields(
            List("body" -> Json.fromString(s"""{"publicKey":"$publicKey"}""")),
          )
          .noSpaces,
      )

    Future(lambdaClient.invoke(request)).attemptT
      .leftMap(_.toString)
      .subflatMap { resp =>
        val responseString = new String(resp.getPayload.array())
        decode[LambdaResponse](responseString)
          .flatMap { lambdaResponse => decode[SetupIntent](lambdaResponse.body) }
          .leftMap(_.toString)
      }
  }
}
