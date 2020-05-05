package controllers

import actions.CustomActionBuilders
import admin.settings.AllSettings
import com.gu.monitoring.SafeLogger
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents}
import ActionBuilder._
import services.{IdentityService, MembersDataService}
import SafeLogger._
import com.gu.identity.model.User
import cats.implicits._

import scala.concurrent.{ExecutionContext, Future}

class DigitalRedemption(
  val actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  membersDataService: MembersDataService,
  components: ControllerComponents
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) with DigitalController {
  import actionRefiners._

  def displayForm() = CachedAction() {
    Ok("hi")
  }

  def processRedemption(): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async { implicit request =>
      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(scrub"Failed to display digital subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error")
          Future.successful(InternalServerError)
        },
        user => {
          userHasDigipack(membersDataService, request.user) map {
            case true => Redirect(routes.DigitalSubscription.displayThankYouExisting().url, request.queryString, status = FOUND)
            case _ => Ok(redemptionForm(user))
          }
        }
      ).flatten
    }

  def redemptionForm(user: User) = {
    "hi"
  }
}
