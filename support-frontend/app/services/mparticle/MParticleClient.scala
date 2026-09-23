package services.mparticle

import admin.settings.{AllSettings, AllSettingsProvider}
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.rest.{CodeBody, WebServiceClientError, WebServiceHelper}
import com.gu.support.config.Stage
import config.{MparticleConfig, MparticleConfigProvider}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax.EncoderOps
import io.circe.{Decoder, Encoder, JsonObject}
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

case class MParticleAudienceData(
    audienceMemberships: List[Int],
    userAttributes: JsonObject,
)

case class ProfileResponse(
    audience_memberships: List[AudienceMembership],
    user_attributes: Option[JsonObject],
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

  private def fetchUserProfile(identityId: String): Future[ProfileResponse] = {
    val fields = "user_attributes,audience_memberships"
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
      fetchUserProfile(identityId)
        .map(parseUserProfile)
        .recover { case WebServiceClientError(CodeBody("404", _)) =>
          logger.info("mParticle returned 404 for user")
          MParticleUserProfile(hasMobileAppDownloaded = false, hasFeastMobileAppDownloaded = false)
        }
    } else {
      Future.successful(MParticleUserProfile(hasMobileAppDownloaded = false, hasFeastMobileAppDownloaded = false))
    }
  }

  def getAudienceData(identityId: String): Future[MParticleAudienceData] = {
    if (mparticleEnabled) {
      fetchUserProfile(identityId)
        .map { profileResponse =>
          MParticleAudienceData(
            audienceMemberships = profileResponse.audience_memberships.map(_.audience_id),
            userAttributes = profileResponse.user_attributes.getOrElse(JsonObject.empty),
          )
        }
        .recover { case WebServiceClientError(CodeBody("404", _)) =>
          logger.info("mParticle returned 404 for user")
          MParticleAudienceData(List.empty, JsonObject.empty)
        }
    } else {
      Future.successful(MParticleAudienceData(List.empty, JsonObject.empty))
    }
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
  }
}
