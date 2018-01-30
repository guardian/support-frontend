package controllers

import actions.CustomActionBuilders
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import models.CheckBankAccountDetails
import play.api.libs.circe.Circe
import play.api.mvc._
import services.paypal.PayPalBillingDetails.codec
import services.{GoCardlessService, GoCardlessServiceProvider, TestUserService}

import scala.concurrent.ExecutionContext
import scala.concurrent.ExecutionContext.Implicits.global

class DirectDebit(
    actionBuilders: CustomActionBuilders,
    components: ControllerComponents,
    goCardlessServiceProvider: GoCardlessServiceProvider,
    testUsers: TestUserService
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

  import actionBuilders._

  def checkAccount: Action[CheckBankAccountDetails] =
    AuthenticatedAction.async(circe.json[CheckBankAccountDetails]) { implicit request =>
      val goCardlessService = goCardlessServiceProvider.forUser(testUsers.isTestUser(request.user))
      goCardlessService.checkBankDetails(request.body).map { isAccountValid =>
        Ok(Map("accountValid" -> isAccountValid).asJson)
      }
    }
}
