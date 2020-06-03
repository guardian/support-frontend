package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.support.redemptions.CorporateCustomer
import com.gu.support.redemptions.redemptions.RedemptionCode
import controllers.RedemptionController._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Result}
import services.{IdentityService, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionRedemptionForm
import cats.implicits._
import scala.concurrent.{ExecutionContext, Future}

class RedemptionController(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  testUsers: TestUserService,
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent]
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) with Circe {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  implicit val settings: AllSettings = settingsProvider.getAllSettings()
  val title = "Support the Guardian | Redeem your code"
  val id = EmptyDiv("subscriptions-redemption-page")
  val js = "subscriptionsRedemptionPage.js"
  val css = "digitalSubscriptionCheckoutPage.css" //TODO: Don't need this?

  def displayForm(redemptionCode: String): Action[AnyContent] = NoCacheAction().async {
    implicit request =>
      getCorporateCustomer(redemptionCode).value.map(
        customerOrError =>
          Ok(subscriptionRedemptionForm(
            title,
            id,
            js,
            css,
            fontLoaderBundle,
            None,
            uatMode = false,
            "checkout",
            redemptionCode,
            customerOrError,
            None,
            submitted = false
          ))
      )

  }

  def displayProcessing(redemptionCode: String): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async {
      implicit request: AuthRequest[Any] =>
        val processingPage = for {
          user <- identityService.getUser(request.user.minimalUser)
          corporateCustomer <- getCorporateCustomer(redemptionCode)
        } yield showProcessing(redemptionCode, corporateCustomer, user)

        processingPage.value.map(
          _.fold(
            BadRequest(_),
            result => result
          )
        )
    }

  def showProcessing(
    redemptionCode: RedemptionCode,
    corporateCustomer: CorporateCustomer,
    user: IdUser)(implicit request: AuthRequest[Any]): Result = {
    val csrf = CSRF.getToken.value
    val testUser = testUsers.isTestUser(user.publicFields.displayName)

    Ok(subscriptionRedemptionForm(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      uatMode = testUser,
      "processing",
      redemptionCode,
      Right(corporateCustomer),
      Some(user),
      submitted = true
    ))
  }

  def validateCode(redemptionCode: String): Action[AnyContent] = CachedAction().async {
    getCorporateCustomer(redemptionCode).value.map(
      _.fold(
        errorString => Ok(RedemptionValidationResult(valid = false, Some(errorString)).asJson),
        customer => Ok(RedemptionValidationResult(valid = true, None).asJson)
      ))
  }
}


// This is just a hard coded fake for the code lookup
object RedemptionController {
  def getCorporateCustomer(redemptionCode: RedemptionCode)(implicit ec: ExecutionContext):
  EitherT[Future, String, CorporateCustomer] =
    if (redemptionCode == "test-code")
      EitherT.fromEither(Right(CorporateCustomer("1", "Test Company", "test-code")))
    else
      EitherT.fromEither(Left("This code is not valid"))
}

