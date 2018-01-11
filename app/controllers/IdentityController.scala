package controllers

import actions.CustomActionBuilders
import com.typesafe.scalalogging.LazyLogging
import play.api.mvc._
import services.IdentityService

import scala.concurrent.{ExecutionContext}

class IdentityController(
    identityService: IdentityService,
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with LazyLogging {

  import actionRefiners._

  def submitMarketing(email: String): Action[AnyContent] = PrivateAction { implicit request =>
    logger.info("email = " + email)
    identityService.sendConsentPreferencesEmail(email)
    Ok
  }
}