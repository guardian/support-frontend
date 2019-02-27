package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.getaddressio.GetAddressIOService
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import scala.concurrent.ExecutionContext.Implicits.global

class GetAddress(
        components: ControllerComponents,
        getAddressService: GetAddressIOService,
        actionRefiners: CustomActionBuilders
      ) extends AbstractController(components) {
  import actionRefiners._
  def findAddress(postCode: String): Action[AnyContent] = NoCacheAction().async { implicit request =>
    getAddressService.find(postCode).map { result =>
      // Capital A 'Addresses' is for compatibility with the https://api.getaddress.io/v2/uk/ response,
      // should a client want not to proxy via this server.
      Ok(Json.obj("Addresses" -> result.Addresses))
    } recover {
      case error if error.getMessage == "Bad Request" || error.getMessage == "Not Found" =>
        BadRequest //The postcode was invalid
      case error =>
        SafeLogger.error(scrub"Failed to complete postcode lookup via getAddress.io due to: $error")
        InternalServerError
    }
  }
}
