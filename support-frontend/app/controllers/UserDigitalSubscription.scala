package controllers

import actions.CustomActionBuilders.AuthRequest
import play.api.mvc.Result
import play.api.mvc.Results._
import play.mvc.Http.Status.FOUND
import services.{AccessCredentials, AuthenticatedIdUser, MembersDataService}
import scala.concurrent.{ExecutionContext, Future}

trait UserDigitalSubscription {
  def userHasDigitalSubscription(
    membersDataService: MembersDataService,
    user: AuthenticatedIdUser
  )(implicit executionContext: ExecutionContext): Future[Boolean] = {
    user.credentials match {
      case cookies: AccessCredentials.Cookies =>
        membersDataService.userAttributes(cookies).value map {
          case Left(_) => false
          case Right(response: MembersDataService.UserAttributes) => response.contentAccess.digitalPack
        }
      case _ => Future.successful(false)
    }
  }

  def redirectToExistingThankYouPage(implicit request: AuthRequest[Any]): Result =
    Redirect(routes.DigitalSubscriptionController.displayThankYouExisting().url, request.queryString, status = FOUND)
}
