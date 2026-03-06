package services.mparticle

import admin.settings.{AllSettings, AllSettingsProvider}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.{CodeBody, WebServiceClientError, WebServiceHelper}
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
    audienceMemberships: List[Int],
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

object MParticleClient {
  implicit val identityEncoder: Encoder[Identity] = deriveEncoder
  implicit val profileRequestEncoder: Encoder[ProfileRequest] = deriveEncoder
  implicit val audienceMembershipDecoder: Decoder[AudienceMembership] = deriveDecoder
  implicit val profileResponseDecoder: Decoder[ProfileResponse] = deriveDecoder
}

class MParticleClient(
    val httpClient: FutureHttpClient,
    mparticleConfigProvider: MparticleConfigProvider,
    stage: Stage,
    settingsProvider: AllSettingsProvider,
)(implicit ec: ExecutionContext, system: ActorSystem)
    extends WebServiceHelper[MParticleError] {

  import MParticleClient._

  private val mparticleConfig: MparticleConfig = mparticleConfigProvider.get()
  private val tokenProvider = new MParticleTokenProvider(httpClient, mparticleConfig, stage)

  override val wsUrl: String = mparticleConfig.apiUrl
  override val verboseLogging: Boolean = false

  // Called from the healthcheck handler. Call this to ensure the MParticleTokenProvider fetches the first batch of tokens
  def initialise(): Unit = {}

  tokenProvider.initialise()

  private def fetchAudienceMemberships(identityId: String): Future[ProfileResponse] = {
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
  }

  private def mparticleEnabled: Boolean =
    settingsProvider.getAllSettings().switches.featureSwitches.enableMParticle.exists(_.isOn)

  def getUserProfile(identityId: String): Future[MParticleUserProfile] = {
    if (mparticleEnabled) {
      fetchAudienceMemberships(identityId)
        .map(parseUserProfile)
        .recover { case WebServiceClientError(CodeBody("404", _)) =>
          logger.info("mParticle returned 404 for user")
          MParticleUserProfile(
            hasMobileAppDownloaded = false,
            hasFeastMobileAppDownloaded = false,
            audienceMemberships = List.empty,
          )
        }
    } else {
      Future.successful(
        MParticleUserProfile(
          hasMobileAppDownloaded = false,
          hasFeastMobileAppDownloaded = false,
          audienceMemberships = List.empty,
        ),
      )
    }
  }

  def isAudienceMember(identityId: String, audienceId: Int): Future[Boolean] = {
    if (mparticleEnabled) {
      fetchAudienceMemberships(identityId)
        .map(response => response.audience_memberships.exists(_.audience_id == audienceId))
        .recover { case WebServiceClientError(CodeBody("404", _)) =>
          logger.info("mParticle returned 404 for user")
          false
        }
    } else {
      Future.successful(false)
    }
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    val audienceMemberships = profileResponse.audience_memberships.map(_.audience_id)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded, audienceMemberships)
  }
}
