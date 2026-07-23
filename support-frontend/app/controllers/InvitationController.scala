package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogging
import play.api.mvc._
import services.MultipleAccountApiService

import scala.concurrent.ExecutionContext

class InvitationController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    multipleAccountApiService: MultipleAccountApiService,
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with SafeLogging {

  import actionRefiners._

  /** Proxies the multiple-account API so that the x-api-key stays server side. The upstream status codes are meaningful
    * to the client (404 = unknown invitation code, 400 = invitation cancelled), so they are passed through along with
    * the response body.
    */
  def getInvitation(invitationId: String): Action[AnyContent] = NoCacheAction().async {
    multipleAccountApiService
      .getInvitation(invitationId)
      .map(response => Status(response.status)(response.body).as(JSON))
      .recover { case err =>
        logger.error(scrub"Failed to fetch invitation from the multiple-account API", err)
        InternalServerError
      }
  }
}
