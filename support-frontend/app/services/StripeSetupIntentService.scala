package services

import cats.data.EitherT
import cats.implicits._
import com.gu.aws.CredentialsProvider
import com.gu.support.config.{Stage, Stages}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.deriveDecoder
import io.circe.parser.decode
import io.circe.{Decoder, Json}
import software.amazon.awssdk.core.SdkBytes
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.lambda.LambdaClient
import software.amazon.awssdk.services.lambda.model.InvokeRequest

import java.nio.charset.Charset
import scala.concurrent.{ExecutionContext, Future}

case class LambdaResponse(body: String)

object LambdaResponse {
  implicit val decoder: Decoder[LambdaResponse] = deriveDecoder
}

case class SetupIntent(client_secret: String)

object SetupIntent {
  implicit val codec: Codec[SetupIntent] = deriveCodec
}

class StripeSetupIntentService(stage: Stage)(implicit ec: ExecutionContext) extends StrictLogging {
  private val charset = Charset.forName("UTF-8")
  private val lambdaClient = LambdaClient
    .builder()
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
    .build()

  private val functionName = stage match {
    case Stages.PROD => "stripe-intent-PROD"
    case _ => "stripe-intent-CODE"
  }

  def apply(publicKey: String)(implicit ec: ExecutionContext): EitherT[Future, String, SetupIntent] = {
    // The lambda expects the input to have the format used by API Gateway
    val payload = SdkBytes.fromString(
      Json
        .fromFields(
          List("body" -> Json.fromString(s"""{"publicKey":"$publicKey"}""")),
        )
        .noSpaces,
      charset,
    )

    val request = InvokeRequest
      .builder()
      .functionName(functionName)
      .payload(payload)
      .build()

    Future(lambdaClient.invoke(request)).attemptT
      .leftMap(_.toString)
      .subflatMap { resp =>
        val responseString = resp.payload().asString(charset)
        decode[LambdaResponse](responseString)
          .flatMap { lambdaResponse => decode[SetupIntent](lambdaResponse.body) }
          .leftMap(_.toString)
      }
  }
}
