package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import com.gu.identity.model.User
import com.gu.monitoring.SafeLogging
import play.api.libs.json.Json
import play.api.mvc._
import play.api.mvc.Security.AuthenticatedRequest
import services.MultipleAccountApiService

import scala.concurrent.{ExecutionContext, Future}

class InvitationController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    multipleAccountApiService: MultipleAccountApiService,
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with SafeLogging {

  import actionRefiners._

  type AuthenticatedUserRequest[A] = AuthenticatedRequest[A, User]

  private val RequireAuthenticatedUser = new ActionRefiner[OptionalAuthRequest, AuthenticatedUserRequest] {
    override protected def executionContext: ExecutionContext = ec

    override protected def refine[A](
        request: OptionalAuthRequest[A],
    ): Future[Either[Result, AuthenticatedUserRequest[A]]] =
      request.user match {
        case Some(user) => Future.successful(Right(new AuthenticatedRequest(user, request)))
        case None =>
          logger.warn("acceptInvitation called but user is not authenticated")
          Future.successful(Left(Unauthorized("User must be authenticated to access this endpoint")))
      }
  }

  /** Proxies the multiple-account API so that the x-api-key stays server side. The upstream status codes are meaningful
    * to the client (404 = unknown invitation code, 400 = invitation cancelled), so they are passed through along with
    * the response body.
    */
  def getInvitation(invitationCode: String): Action[AnyContent] = NoCacheAction().async {
    multipleAccountApiService
      .getInvitation(invitationCode)
      .map(response => Status(response.status)(response.body).as(JSON))
      .recover { case err =>
        logger.error(scrub"Failed to fetch invitation from the multiple-account API", err)
        InternalServerError
      }
  }

  /** Proxies accepting an invitation. Authenticates the signed-in user from Okta cookies and forwards their identity id
    * as x-identity-id plus Authorization bearer (API requires both). Upstream status codes are passed through.
    */
  def acceptInvitation(invitationCode: String): Action[AnyContent] =
    (MaybeAuthenticatedActionOnFormSubmission andThen RequireAuthenticatedUser).async { implicit request =>
      request.cookies.get("GU_ACCESS_TOKEN") match {
        case Some(cookie) =>
          logger.info(
            s"acceptInvitation debug — identityId=${request.user.id}, accessToken=${cookie.value}",
          )
          multipleAccountApiService
            .acceptInvitation(invitationCode, request.user.id, cookie.value)
            .map(response => Status(response.status)(response.body))
            .recover { case err =>
              logger.error(scrub"Failed to accept invitation via the multiple-account API", err)
              InternalServerError
            }
        case None =>
          logger.error(scrub"No GU_ACCESS_TOKEN cookie found when accepting invitation")
          Future.successful(Unauthorized("No access token found"))
      }
    }

  /** Proxies declining an invitation without requiring the invitee to be signed in. Looks up the invitation to obtain
    * the secondaryIdentityId, then deletes with that identity id so the upstream API records a secondary rejection.
    * CSRF is enforced; login is not. Upstream status codes are passed through.
    */
  def deleteInvitation(invitationCode: String): Action[AnyContent] =
    MaybeAuthenticatedActionOnFormSubmission.async { _ =>
      multipleAccountApiService
        .getInvitation(invitationCode)
        .flatMap { getResponse =>
          if (getResponse.status != 200) {
            Future.successful(Status(getResponse.status)(getResponse.body))
          } else {
            (Json.parse(getResponse.body) \ "secondaryIdentityId").asOpt[String] match {
              case Some(secondaryIdentityId) =>
                multipleAccountApiService
                  .deleteInvitation(invitationCode, secondaryIdentityId)
                  .map(response => Status(response.status)(response.body))
                  .recover { case err =>
                    logger.error(scrub"Failed to delete invitation via the multiple-account API", err)
                    InternalServerError
                  }
              case None =>
                logger.error(scrub"Invitation response missing secondaryIdentityId")
                Future.successful(InternalServerError("Invitation response missing secondaryIdentityId"))
            }
          }
        }
        .recover { case err =>
          logger.error(scrub"Failed to fetch invitation before delete from the multiple-account API", err)
          InternalServerError
        }
    }
}
