package services.mparticle

import com.gu.monitoring.SafeLogging
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.WebServiceHelper
import com.gu.support.config.Stage
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax.EncoderOps
import io.circe.{Decoder, Encoder}
import org.apache.pekko.actor.ActorSystem

import scala.concurrent.{ExecutionContext, Future}

case class MParticleUserProfile(
    hasMobileAppDownloaded: Boolean,
    hasFeastMobileAppDownloaded: Boolean,
)

case class Identity(
    `type`: String,
    value: String,
)

case class ProfileRequest(
    environment_type: String,
    identity: Identity,
)

case class AudienceMembership(
    audience_id: Int,
)

case class ProfileResponse(
    audience_memberships: List[AudienceMembership],
)

case class MParticleError(message: String) extends Throwable(message)

object MParticleClient {
  implicit val identityEncoder: Encoder[Identity] = deriveEncoder
  implicit val profileRequestEncoder: Encoder[ProfileRequest] = deriveEncoder
  implicit val audienceMembershipDecoder: Decoder[AudienceMembership] = deriveDecoder
  implicit val profileResponseDecoder: Decoder[ProfileResponse] = deriveDecoder
  implicit val mparticleErrorDecoder: Decoder[MParticleError] = deriveDecoder
}

class MParticleClient(
    val httpClient: FutureHttpClient,
    mparticleConfigProvider: MparticleConfigProvider,
    stage: Stage,
)(implicit ec: ExecutionContext, system: ActorSystem)
    extends WebServiceHelper[MParticleError]
    with SafeLogging {

  import MParticleClient._

  private lazy val mparticleConfig: MparticleConfig = mparticleConfigProvider.get()
  private lazy val tokenProvider = new MParticleTokenProvider(httpClient, mparticleConfig, stage)

  override val wsUrl: String = mparticleConfig.apiUrl
  override val verboseLogging: Boolean = false

  def getUserProfile(identityId: String): Future[MParticleUserProfile] = {
    val fields = "audience_memberships"
    val endpoint =
      s"userprofile/v1/resolve/${mparticleConfig.orgId}/${mparticleConfig.accountId}/${mparticleConfig.workspaceId}"

    val request = ProfileRequest(
      environment_type = mparticleConfig.apiEnv,
      identity = Identity(`type` = "customer_id", value = identityId),
    )

    tokenProvider
      .requestWithToken(accessToken =>
        postJson[ProfileResponse](
          endpoint = endpoint,
          data = request.asJson,
          headers = Map("Authorization" -> s"Bearer ${accessToken.token}"),
          params = Map("fields" -> fields),
        ),
      )
      .map(parseUserProfile)
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
  }
}
