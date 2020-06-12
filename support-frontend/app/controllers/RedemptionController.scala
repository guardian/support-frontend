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
import services.{AccessCredentials, AuthenticatedIdUser, IdentityService, MembersDataService, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionRedemptionForm
import cats.implicits._
import com.gu.monitoring.SafeLogger
import SafeLogger._
import controllers.UserDigitalSubscription.{redirectToExistingThankYouPage, userHasDigitalSubscription}
import lib.RedirectWithEncodedQueryString
import play.twirl.api.Html

import scala.concurrent.{ExecutionContext, Future}

class RedemptionController(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  membersDataService: MembersDataService,
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
            title = title,
            mainElement = id,
            js = js,
            css = css,
            fontLoaderBundle = fontLoaderBundle,
            csrf = None,
            uatMode = false,
            stage = "checkout",
            redemptionCode = redemptionCode,
            customerOrError = customerOrError,
            user = None,
            submitted = false
          ))
      )

  }

  def displayThankYou(stage: String): Action[AnyContent] = authenticatedAction(subscriptionsClientId).async {
    implicit request: AuthRequest[Any] =>
      identityService.getUser(request.user.minimalUser).fold(
        error => {
          SafeLogger.error(scrub"Failed to retrieve user email for thank you page so marketing consent was not shown. Error was - ${error}")
          thankYouPage(stage, None)
        },
        user => thankYouPage(stage, Some(user))
      )
  }

  def thankYouPage(stage:String, user: Option[IdUser])(implicit request: AuthRequest[Any]): Result =
    Ok(views.html.main(
      title = title,
      mainElement = id,
      mainJsBundle = Left(RefPath(js)),
      mainStyleBundle = Left(RefPath(css)),
      fontLoaderBundle = fontLoaderBundle,
      csrf = Some(CSRF.getToken.value)
    ) {
      Html(s"""
        <script type="text/javascript">
          window.guardian.stage = "${stage}";
          window.guardian.user = {
            firstName: "${user.map(_.privateFields.firstName).getOrElse("")}",
            lastName: "${user.map(_.privateFields.secondName).getOrElse("")}",
            email: "${user.map(_.primaryEmailAddress).getOrElse("")}",
          };
        </script>""")
    })

  def displayError(redemptionCode: RedemptionCode, error: String)(implicit request: AuthRequest[Any]): Result = {
    SafeLogger.error(scrub"An error occurred while trying to process redemption code - ${redemptionCode}. Error was - ${error}")
    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
      fontLoaderBundle = fontLoaderBundle,
      csrf = None,
      uatMode = false,
      stage = "checkout",
      redemptionCode = redemptionCode,
      Left("Unfortunately we were unable to process your code, please try again later"),
      user = None,
      submitted = false
    ))
  }

  def displayProcessing(redemptionCode: String): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async {
      implicit request: AuthRequest[Any] =>
        userHasDigitalSubscription(membersDataService, request.user).flatMap(
          userHasSub =>
            if (userHasSub)
              Future.successful(redirectToExistingThankYouPage)
            else
              tryToShowProcessingPage(redemptionCode)
        )
    }

  private def tryToShowProcessingPage(redemptionCode: RedemptionCode)(implicit request: AuthRequest[Any]) = {
    val processingPage: EitherT[Future, String, Result] = for {
      user <- identityService.getUser(request.user.minimalUser)
      corporateCustomer <- getCorporateCustomer(redemptionCode)
    } yield showProcessing(redemptionCode, corporateCustomer, user)

    processingPage.value.map(
      maybeResult =>
        maybeResult.fold(
          error => displayError(redemptionCode, error),
          result => result
        )
    )
  }

  private def showProcessing(
    redemptionCode: RedemptionCode,
    corporateCustomer: CorporateCustomer,
    user: IdUser
  )(implicit request: AuthRequest[Any]): Result = {
    val csrf = CSRF.getToken.value
    val testUser = testUsers.isTestUser(user.publicFields.displayName)

    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
      fontLoaderBundle = fontLoaderBundle,
      csrf = Some(csrf),
      uatMode = testUser,
      stage = "processing",
      redemptionCode = redemptionCode,
      customerOrError = Right(corporateCustomer),
      user = Some(user),
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

  def redirect(redemptionCode: RedemptionCode): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(routes.RedemptionController.displayForm(redemptionCode).url, request.queryString, status = MOVED_PERMANENTLY)
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

