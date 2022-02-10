package controllers

import backend.GoCardlessBackend
import model.directdebit.{CheckDirectDebitDetailsData, CheckDirectDebitDetailsResponse}
import actions.CorsActionProvider
import com.gocardless.errors.GoCardlessApiException
import com.typesafe.scalalogging.StrictLogging
import model.{DefaultThreadPool, ResultBody}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider
import ActionOps.Extension

class GoCardlessController(
    cc: ControllerComponents,
    goCardlessBackendProvider: RequestBasedProvider[GoCardlessBackend],
)(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc)
    with Circe
    with JsonUtils
    with StrictLogging
    with CorsActionProvider {

  import cats.implicits._
  import util.RequestTypeDecoder.instances._

  def checkBankAccount: Action[CheckDirectDebitDetailsData] = CorsAction
    .async(circe.json[CheckDirectDebitDetailsData]) { request =>
      {
        goCardlessBackendProvider
          .getInstanceFor(request)
          .checkBankAccount(request.body)
          .fold(
            checkBankAccountErrorToResponse,
            accountValidation => Ok(ResultBody.Success(accountValidation)),
          )
      }
    }
    .withLogging(this.getClass.getCanonicalName, "checkBankAccount")

  private def checkBankAccountErrorToResponse(error: Throwable) = error match {
    case goCardlessApiException: GoCardlessApiException =>
      Ok(ResultBody.Success(CheckDirectDebitDetailsResponse(false, Some(goCardlessApiException.getCode))))
    case _ =>
      InternalServerError
  }

  override implicit val controllerComponents: ControllerComponents = cc
  override implicit val corsUrls: List[String] = allowedCorsUrls
}
