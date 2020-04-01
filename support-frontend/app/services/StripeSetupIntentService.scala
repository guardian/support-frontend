package services

import cats.data.EitherT
import cats.implicits._
import com.amazonaws.regions.Regions
import com.amazonaws.services.lambda.AWSLambdaClientBuilder
import com.amazonaws.services.lambda.model.InvokeRequest
import com.gu.support.config.{Stage, Stages}
import com.typesafe.scalalogging.StrictLogging
import io.circe.Encoder
import io.circe.generic.semiauto.deriveEncoder
import play.api.libs.json._

import scala.concurrent.{ExecutionContext, Future}

case class SetupIntent(client_secret: String)
object SetupIntent {
  implicit val reads: Reads[SetupIntent] = Json.reads[SetupIntent]
  implicit val encoder: Encoder[SetupIntent] = deriveEncoder
}

class StripeSetupIntentService(stage: Stage)(implicit ec: ExecutionContext)  extends StrictLogging {

    private val lambdaClient = AWSLambdaClientBuilder
      .standard()
      .withRegion(Regions.EU_WEST_1.getName)
      .withCredentials(aws.CredentialsProvider)
      .build()

    private val functionName = stage match {
      case Stages.PROD => "stripe-intent-PROD"
      case _ => "stripe-intent-CODE"
    }

    def apply(apiKey: String)(implicit ec: ExecutionContext): EitherT[Future, String, SetupIntent] = {
      val request = new InvokeRequest()
        .withFunctionName(functionName)
        .withPayload("")

      Future(lambdaClient.invoke(request))
        .attemptT
        .leftMap(_.toString)
        .subflatMap { resp =>
          Json.parse(resp.getPayload.toString)
            .validate[SetupIntent]
            .asEither.leftMap(_.mkString(","))
        }
    }
}
