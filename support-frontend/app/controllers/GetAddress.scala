package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettingsProvider, On}
import com.gu.monitoring.SafeLogging
import com.gu.support.getaddressio.{FindAddressResultError, GetAddressIOService}
import com.gu.support.idealpostcodes.IdealPostcodesService
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class GetAddress(
    components: ControllerComponents,
    getAddressService: GetAddressIOService,
    idealPostcodesService: IdealPostcodesService,
    settingsProvider: AllSettingsProvider,
    actionRefiners: CustomActionBuilders,
) extends AbstractController(components)
    with Circe
    with SafeLogging {
  import actionRefiners._

  private def doPostcodeLookup(postCode: String) = {
    if (settingsProvider.getAllSettings().switches.subscriptionsSwitches.useIdealPostcodes.contains(On))
      idealPostcodesService.find(postCode)
    else
      getAddressService.find(postCode)
  }

  def findAddress(postCode: String): Action[AnyContent] = NoCacheAction().async { implicit request =>
    if (postCode.length > 10) {
      // the address service returns bad results (404s) for some long
      // and weird input values; avoid calling it
      Future(BadRequest)
    } else {
      doPostcodeLookup(postCode).map { result =>
        Ok(result.asJson)
      } recover {
        case _: FindAddressResultError =>
          BadRequest // The postcode was invalid
        case error =>
          logger.error(scrub"Failed to complete postcode lookup via getAddress.io due to: $error")
          InternalServerError
      }
    }
  }
}
