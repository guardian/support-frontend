package controllers

import actions.CustomActionBuilders
import com.gu.monitoring.SafeLogging
import play.api.Environment
import play.api.libs.json.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import java.nio.file.{Files, Path}
import scala.util.Try

class VatComplianceController(
    components: ControllerComponents,
    actionRefiners: CustomActionBuilders,
    environment: Environment,
) extends AbstractController(components)
    with SafeLogging {

  import actionRefiners._

  private val vatComplianceConfigPath: Path =
    environment.rootPath.toPath.getParent.resolve("modules/VATComplianceAmounts.json")

  def getVatComplianceConfig(): Action[AnyContent] = CachedAction() { implicit request =>
    if (!Files.exists(vatComplianceConfigPath)) {
      logger.error(scrub"VAT compliance config file not found at $vatComplianceConfigPath")
      NotFound("VAT compliance config file not found")
    } else {
      val rawJson = Files.readString(vatComplianceConfigPath)

      Try(Json.parse(rawJson)).toEither match {
        case Right(json) => Ok(json)
        case Left(error) =>
          logger.error(scrub"Failed to parse VAT compliance config JSON: ${error.getMessage}")
          InternalServerError("Invalid VAT compliance config JSON")
      }
    }
  }
}
