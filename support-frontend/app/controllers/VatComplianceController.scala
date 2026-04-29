package controllers

import actions.CustomActionBuilders
import cats.implicits._
import com.gu.monitoring.SafeLogging
import play.api.Environment
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}

import java.io.FileNotFoundException
import java.nio.file.Path
import scala.io.Source
import scala.util.Try

object VatComplianceConfig {

  def fromLocalFile(path: Path): Either[Throwable, JsValue] =
    for {
      buf <- Try {
        Source.fromFile(path.toFile)
      }.toEither
      settings <- Try(Json.parse(buf.mkString)).toEither
      _ <- Try(buf.close()).toEither
    } yield settings
}

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
    VatComplianceConfig.fromLocalFile(vatComplianceConfigPath) match {
      case Right(json) => Ok(json)
      case Left(_: FileNotFoundException) =>
        logger.error(scrub"VAT compliance config file not found at $vatComplianceConfigPath")
        NotFound("VAT compliance config file not found")
      case Left(error) =>
        logger.error(scrub"Failed to load VAT compliance config JSON: ${error.getMessage}")
        InternalServerError("Invalid VAT compliance config JSON")
    }
  }
}
