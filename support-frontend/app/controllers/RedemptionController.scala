package controllers

import java.util.Locale

import actions.CustomActionBuilders
import actions.CustomActionBuilders.{AuthRequest, OptionalAuthRequest}
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.redemption.corporate.{DynamoTableAsync, GetCodeStatus}
import com.gu.support.redemption.gifting.{Expired, GiftRedemptionState, Redeemed, Unredeemed}
import com.gu.support.redemption.gifting.generator.CodeBuilder.GiftCode
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.redemptions.redemptions.RawRedemptionCode
import com.gu.support.zuora.api.response.SubscriptionRedemptionQueryResponse
import com.gu.zuora.ZuoraService
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

trait DynamoTableAsyncForUser {
  def apply(isTestUser: Boolean): DynamoTableAsync
}

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
  dynamoLookup: DynamoTableAsyncForUser
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
  val testUserFromRequest = new TestUserFromRequest(identityService, testUsers)

  def displayForm(redemptionCode: RawRedemptionCode): Action[AnyContent] = (googleAuthAction andThen maybeAuthenticatedAction()).async {
    implicit request =>
      for {
        isTestUser <- testUserFromRequest.isTestUser(request)
        normalisedCode = redemptionCode.toUpperCase(Locale.UK)
        form <- getCorporateCustomer(redemptionCode, isTestUser).fold(Some.apply, _ => None).map(
          maybeError =>
            Ok(subscriptionRedemptionForm(
              title = title,
              mainElement = id,
              js = js,
              css = css,
              fontLoaderBundle = fontLoaderBundle,
              csrf = None,
              isTestUser = isTestUser,
              stage = "checkout",
              redemptionCode = normalisedCode,
              maybeRedemptionError = maybeError,
              user = None,
              submitted = false
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

  def displayError(redemptionCode: RawRedemptionCode, error: String, isTestUser: Boolean)(implicit request: AuthRequest[Any]): Result = {
    SafeLogger.error(scrub"An error occurred while trying to process redemption code - ${redemptionCode}. Error was - ${error}")
    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
      fontLoaderBundle = fontLoaderBundle,
      csrf = None,
      isTestUser = isTestUser,
      stage = "checkout",
      redemptionCode = redemptionCode,
      Some("Unfortunately we were unable to process your code, please try again later"),
      user = None,
      submitted = false
    ))
  }

  def displayProcessing(redemptionCode: RawRedemptionCode): Action[AnyContent] =
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

  private def tryToShowProcessingPage(redemptionCode: RawRedemptionCode)(implicit request: AuthRequest[Any]) = {
    val processingPage: EitherT[Future, (String, Boolean), Result] = for {
      user <- identityService.getUser(request.user.minimalUser).leftMap((_, false))
      isTestUser = testUserFromRequest.fromIdUser(user)
      _ <- getCorporateCustomer(redemptionCode, isTestUser).leftMap((_, isTestUser))
    } yield showProcessing(redemptionCode, user)

    processingPage.leftMap {
      case (error, isTestUser) => displayError(redemptionCode, error, isTestUser)
    }.merge
  }

  private def showProcessing(
    redemptionCode: RawRedemptionCode,
    user: IdUser
  )(implicit request: AuthRequest[Any]): Result =
    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
      fontLoaderBundle = fontLoaderBundle,
      csrf = Some(CSRF.getToken.value),
      isTestUser = testUserFromRequest.fromIdUser(user),
      stage = "processing",
      redemptionCode = redemptionCode,
      maybeRedemptionError = None,
      user = Some(user),
      submitted = true
    ))

  def validateCode(redemptionCode: RawRedemptionCode, isTestUser: Option[Boolean]): Action[AnyContent] = CachedAction().async {
    getCorporateCustomer(redemptionCode, isTestUser.getOrElse(false)).fold(Some.apply, _ => None).map(
      maybeError => Ok(RedemptionValidationResult(valid = maybeError.isEmpty, maybeError).asJson)
    )
  }

  def redirect(redemptionCode: RawRedemptionCode): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(routes.RedemptionController.displayForm(redemptionCode).url, request.queryString, status = MOVED_PERMANENTLY)
  }
}

class TestUserFromRequest(identityService: IdentityService, testUsers: TestUserService) {

  def isTestUser(request: OptionalAuthRequest[AnyContent])(implicit req: RequestHeader, ec: ExecutionContext): Future[Boolean] =
    request.user.map { authenticatedIdUser =>
      identityService.getUser(authenticatedIdUser.minimalUser)
    } match {
      case None => Future.successful(fromCookies(request.cookies))
      case Some(eventualErrorOrUser) =>
        eventualErrorOrUser.fold(
          message => {
            SafeLogger.error(scrub"could not fetch user - assuming normal backend: $message")
            false
          },
          fromIdUser
        )
    }

  def fromCookies(cookies: Cookies): Boolean = {
    val maybeCookieValue = cookies.get("_test_username").map(_.value)
    testUsers.isTestUser(maybeCookieValue)
  }

  def fromIdUser(user: IdUser): Boolean = {
    val displayName = user.publicFields.displayName
    testUsers.isTestUser(displayName)
  }

}

class GetCorporateCustomer(dynamoLookup: DynamoTableAsyncForUser) {

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

object GiftCodeValidator {
  def verify(inputCode: String, zuoraService: ZuoraService)(implicit ec: ExecutionContext): EitherT[Future, String, Unit] =
    for {
      codeToCheck <- EitherT.fromEither[Future](RedemptionCode(inputCode)).leftMap(_ => "Please check the code and try again")
      zuoraResponse <- EitherT.right[String](zuoraService.getSubscriptionFromRedemptionCode(codeToCheck))
      _ <- EitherT.fromEither[Future](GiftRedemptionState.getSubscriptionState(zuoraResponse, "") match {
        case Unredeemed(_) => Right(())
        case Redeemed => Left("This code has already been redeemed")
        case Expired => Left("This code has expired")
        case _ => Left("Please check the code and try again")
      })
    } yield ()

}

