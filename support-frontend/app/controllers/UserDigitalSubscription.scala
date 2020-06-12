package controllers

import actions.CustomActionBuilders.AuthRequest
import com.gu.monitoring.SafeLogger
import play.api.mvc.Result
import play.api.mvc.Results._
import play.mvc.Http.Status.FOUND
import services.{AccessCredentials, AuthenticatedIdUser, MembersDataService}
import SafeLogger._
import scala.concurrent.{ExecutionContext, Future}

object UserDigitalSubscription {
  def userHasDigitalSubscription(
    membersDataService: MembersDataService,
    user: AuthenticatedIdUser
  )(implicit executionContext: ExecutionContext): Future[Boolean] = {
    user.credentials match {
      case cookies: AccessCredentials.Cookies =>
        membersDataService.userAttributes(cookies).value map {
          case Left(err: MembersDataService.MembersDataServiceError) => {
            SafeLogger.error(scrub"Got an error from members-data-api ${err}")
            false
          }
          case Right(response: MembersDataService.UserAttributes) => response.contentAccess.digitalPack
        }
      case _ => {
        SafeLogger.warn(
          s"Couldn't call members-data-api to check subscription status for user ${user.minimalUser.id} because their access cookies were missing"
        )
        Future.successful(false)
      }
    }
  }

  def redirectToExistingThankYouPage(implicit request: AuthRequest[Any]): Result =
    Redirect(routes.DigitalSubscriptionController.displayThankYouExisting().url, request.queryString, status = FOUND)
}
