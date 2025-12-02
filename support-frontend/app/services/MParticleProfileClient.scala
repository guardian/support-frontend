package services

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import io.circe.{Decoder, Encoder}

import scala.concurrent.{ExecutionContext, Future}

case class Identity(
    `type`: String,
    value: String,
)

case class ProfileRequest(
    environment_type: String,
    identity: Identity,
)

object ProfileRequest {
  implicit val identityEncoder: Encoder[Identity] = deriveEncoder
  implicit val profileRequestEncoder: Encoder[ProfileRequest] = deriveEncoder
}
case class AudienceMembership(
    audience_id: Int,
)

case class ProfileResponse(
    audience_memberships: List[AudienceMembership],
)

object ProfileResponse {
  implicit val audienceMembershipDecoder: Decoder[AudienceMembership] = deriveDecoder
  implicit val profileResponseDecoder: Decoder[ProfileResponse] = deriveDecoder
}

class MParticleProfileClient(mparticleClient: MParticleClient)(implicit ec: ExecutionContext) {

  def getUserProfile(identityId: String): Future[MParticleUserProfile] = {
    val fields = "audience_memberships"
    val endpoint =
      s"userprofile/v1/resolve/${mparticleClient.mparticleConfig.orgId}/${mparticleClient.mparticleConfig.accountId}/${mparticleClient.mparticleConfig.workspaceId}"

    val request = ProfileRequest(
      environment_type = mparticleClient.mparticleConfig.apiEnv,
      identity = Identity(`type` = "customer_id", value = identityId),
    )

    for {
      response <- mparticleClient.postJsonWithAuth[ProfileResponse](
        endpoint = endpoint,
        data = request.asJson,
        params = Map("fields" -> fields),
      )
    } yield parseUserProfile(response)
  }

  private def parseUserProfile(profileResponse: ProfileResponse): MParticleUserProfile = {
    val hasMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22581)
    val hasFeastMobileAppDownloaded = profileResponse.audience_memberships.exists(_.audience_id == 22582)
    MParticleUserProfile(hasMobileAppDownloaded, hasFeastMobileAppDownloaded)
  }

}
