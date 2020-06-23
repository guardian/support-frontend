package controllers

import java.util.Locale

import actions.CustomActionBuilders.AuthRequest
import actions.{CacheControl, CustomActionBuilders}
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.redemption.{DynamoLookup, GetCodeStatus}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.redemptions.redemptions.RawRedemptionCode
import controllers.UserDigitalSubscription.{redirectToExistingThankYouPage, userHasDigitalSubscription}
import io.circe.syntax._
import lib.RedirectWithEncodedQueryString
import play.api.libs.circe.Circe
import play.api.mvc._
import play.twirl.api.Html
import services.{IdentityService, MembersDataService, TestUserService}
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionRedemptionForm

import scala.concurrent.{ExecutionContext, Future}

class RedemptionController(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  membersDataService: MembersDataService,
  testUsers: TestUserService,
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent],
  googleAuthAction: AuthAction[AnyContent],
  dynamoLookup: Boolean => DynamoLookup
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

  val getCorporateCustomer = new GetCorporateCustomer(dynamoLookup)

  def displayForm(redemptionCode: RawRedemptionCode): Action[AnyContent] = (googleAuthAction andThen maybeAuthenticatedAction()).async {
    implicit request =>
      for {
        whyIsTestUser <- request.user match {
          case None =>
            val maybeCookie = request.cookies.get("_test_username")
            val isTestUser = testUsers.isTestUser(maybeCookie.map(_.value))
            Future.successful(if (isTestUser) Some("Cookie _test_username is set to a test user token") else None)
          case Some(authenticatedIdUser) =>
            identityService.getUser(authenticatedIdUser.minimalUser).fold({message =>
              SafeLogger.error(scrub"could not fetch user - assuming normal backend: $message")
              None
            }, { fullUser =>
              if (testUsers.isTestUser(fullUser.publicFields.displayName))
                Some("Your identity displayName is a test user token")
              else
                None
            })
        }
        normalisedCode = redemptionCode.toUpperCase(Locale.UK)
        form <- getCorporateCustomer(normalisedCode, whyIsTestUser.isDefined).fold(Some.apply, _ => None).map(
          maybeError =>
            Ok(subscriptionRedemptionForm(
              title = title,
              mainElement = id,
              js = js,
              css = css,
              fontLoaderBundle = fontLoaderBundle,
              csrf = None,
              uatMode = false,
              stage = "checkout",
              redemptionCode = normalisedCode,
              maybeRedemptionError = maybeError,
              user = None,
              submitted = false,
              whyIsTestUser = whyIsTestUser
            ))
        )
      } yield form

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

  def thankYouPage(stage: String, user: Option[IdUser])(implicit request: AuthRequest[Any]): Result =
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

  def displayError(redemptionCode: RawRedemptionCode, error: String, whyIsTestUser: Option[String])(implicit request: AuthRequest[Any]): Result = {
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
      Some("Unfortunately we were unable to process your code, please try again later"),
      user = None,
      submitted = false,
      whyIsTestUser = whyIsTestUser
    ))
  }

  def displayProcessing(redemptionCode: RawRedemptionCode): Action[AnyContent] =
    authenticatedAction(subscriptionsClientId).async {
      implicit request: AuthRequest[Any] =>
        userHasDigitalSubscription(membersDataService, request.user).flatMap(
          userHasSub =>
            if (userHasSub)
              Future.successful(redirectToExistingThankYouPage)
            else {
              identityService.getUser(request.user.minimalUser).map { fullUser =>
                testUsers.isTestUser(fullUser.publicFields.displayName)
              }.value.flatMap{
                case Left(message) =>
                  SafeLogger.error(scrub"could not fetch user: $message")
                  Future.successful(InternalServerError("could not fetch user"))
                case Right(isTestUser) => tryToShowProcessingPage(redemptionCode, if (isTestUser) Some("identity displayName") else None)
              }
            }
        )
    }

  private def tryToShowProcessingPage(redemptionCode: RawRedemptionCode, whyIsTestUser: Option[String])(implicit request: AuthRequest[Any]) = {
    val processingPage: EitherT[Future, String, Result] = for {
      user <- identityService.getUser(request.user.minimalUser)
      _ <- getCorporateCustomer(redemptionCode, whyIsTestUser.isDefined)
    } yield showProcessing(redemptionCode, user)

    processingPage.value.map(
      maybeResult =>
        maybeResult.fold(
          error => displayError(redemptionCode, error, whyIsTestUser),
          result => result
        )
    )
  }

  private def showProcessing(
    redemptionCode: RawRedemptionCode,
    user: IdUser
  )(implicit request: AuthRequest[Any]): Result = {
    val csrf = CSRF.getToken.value
    val whyIsTestUser = if (testUsers.isTestUser(user.publicFields.displayName))
      Some("identity displayName")
    else
      None


    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
      fontLoaderBundle = fontLoaderBundle,
      csrf = Some(csrf),
      uatMode = whyIsTestUser.isDefined,
      stage = "processing",
      redemptionCode = redemptionCode,
      maybeRedemptionError = None,
      user = Some(user),
      submitted = true,
      whyIsTestUser = whyIsTestUser
    ))
  }

  def validateCode(redemptionCode: RawRedemptionCode, isTestUser: Option[Boolean]): Action[AnyContent] = CachedAction().async {
    getCorporateCustomer(redemptionCode, isTestUser.getOrElse(false)).fold(Some.apply, _ => None).map(
      maybeError => Ok(RedemptionValidationResult(valid = maybeError.isEmpty, maybeError).asJson)
    )
  }

  def redirect(redemptionCode: RawRedemptionCode): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(routes.RedemptionController.displayForm(redemptionCode).url, request.queryString, status = MOVED_PERMANENTLY)
  }
}


// This is just a hard coded fake for the code lookup
class GetCorporateCustomer(dynamoLookup: Boolean => DynamoLookup) {

  def apply(redemptionCode: String, isTestUser: Boolean)(implicit ec: ExecutionContext): EitherT[Future, String, Unit] = {
    val getCodeStatus = GetCodeStatus.withDynamoLookup(dynamoLookup(isTestUser))

    for {
      codeToCheck <- EitherT.fromEither[Future](RedemptionCode(redemptionCode)).leftMap(_ => "Please check the code and try again")
      _ <- EitherT(getCodeStatus(codeToCheck)).leftMap {
        case GetCodeStatus.NoSuchCode => "Please check the code and try again"
        case GetCodeStatus.CodeAlreadyUsed => "Your code has already been redeemed"
      }
    } yield ()
  }

}

