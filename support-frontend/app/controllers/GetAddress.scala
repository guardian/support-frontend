package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.rest.{CodeBody, WebServiceHelperError}
import com.gu.support.getaddressio.GetAddressIOService
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import com.gu.support.getaddressio.FindAddressResultError

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GetAddress(
    components: ControllerComponents,
    getAddressService: GetAddressIOService,
    actionRefiners: CustomActionBuilders,
) extends AbstractController(components)
    with Circe {
  import actionRefiners._

  def findAddress(postCode: String): Action[AnyContent] = NoCacheAction().async { implicit request =>
    if (postCode.length > 10) {
      // the address service returns bad results (404s) for some long
      // and weird input values; avoid calling it
      Future(BadRequest)
    } else {
      getAddressService.find(postCode).map { result =>
        Ok(result.asJson)
      } recover {
        case _: FindAddressResultError =>
          BadRequest // The postcode was invalid
        case error =>
          SafeLogger.error(scrub"Failed to complete postcode lookup via getAddress.io due to: $error")
          InternalServerError
      }
    }
  }
}
