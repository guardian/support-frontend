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
import com.gu.support.redemption.corporate.{CorporateCodeValidator, DynamoTableAsync}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption._
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.redemptions.redemptions.RawRedemptionCode
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.{Corporate, Gift}
import com.gu.zuora.{ZuoraGiftLookupService, ZuoraGiftLookupServiceProvider}
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
  dynamoLookup: DynamoTableAsyncForUser,
  zuoraLookupServiceProvider: ZuoraGiftLookupServiceProvider
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

  val testUserFromRequest = new TestUserFromRequest(identityService, testUsers)

  def displayForm(redemptionCode: RawRedemptionCode): Action[AnyContent] = (googleAuthAction andThen maybeAuthenticatedAction()).async {
    implicit request =>
      for {
        isTestUser <- testUserFromRequest.isTestUser(request)
        codeValidator = new CodeValidator(zuoraLookupServiceProvider.forUser(isTestUser), dynamoLookup)
        normalisedCode = redemptionCode.toUpperCase(Locale.UK)
        form <- codeValidator.validate(redemptionCode, isTestUser).value.map(
          validationResult =>
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
              maybeReaderType = validationResult.right.toOption,
              maybeRedemptionError = validationResult.left.toOption,
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
      maybeReaderType = None,
      Some(s"Unfortunately we were unable to process your code. ${error}"),
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
      codeValidator = new CodeValidator(zuoraLookupServiceProvider.forUser(isTestUser), dynamoLookup)
      readerType <- codeValidator.validate(redemptionCode, isTestUser).leftMap((_, isTestUser))
    } yield showProcessing(redemptionCode, readerType, user)

    processingPage.leftMap {
      case (error, isTestUser) => displayError(redemptionCode, error, isTestUser)
    }.merge
  }

  private def showProcessing(
    redemptionCode: RawRedemptionCode,
    readerType: ReaderType,
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
      maybeReaderType = Some(readerType),
      user = Some(user),
      submitted = true
    ))

  def validateCode(redemptionCode: RawRedemptionCode, isTestUser: Option[Boolean]): Action[AnyContent] = CachedAction().async {
    val testUser = isTestUser.getOrElse(false)
    val codeValidator = new CodeValidator(zuoraLookupServiceProvider.forUser(testUser), dynamoLookup)
    codeValidator.validate(redemptionCode, testUser).value.map {
      validationResult =>
      SafeLogger.info(s"Validating code ${redemptionCode}: ${validationResult}")
      Ok(RedemptionValidationResult(
        valid = validationResult.isRight,
        readerType = validationResult.right.toOption,
        errorMessage = validationResult.left.toOption).asJson
      )
    }
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

class CodeValidator(zuoraLookupService: ZuoraGiftLookupService, dynamoLookup: DynamoTableAsyncForUser) {

  def validate(inputCode: String, isTestUser: Boolean)(implicit ec: ExecutionContext): EitherT[Future, String, ReaderType] =
    EitherT(getValidationResult(inputCode, isTestUser).map {
      case ValidCorporateCode(_) => Right(Corporate)
      case ValidGiftCode(_) => Right(Gift)
      case CodeAlreadyUsed => Left("This code has already been redeemed")
      case CodeExpired => Left("This code has expired")
      case _: InvalidCode | CodeNotFound | CodeRedeemedInThisRequest => Left("Please check the code and try again")
    })

  private def getValidationResult(inputCode: String, isTestUser: Boolean)(implicit ec: ExecutionContext): Future[CodeValidationResult] = {
    val corporateValidator = CorporateCodeValidator.withDynamoLookup(dynamoLookup(isTestUser))
    val giftValidator = new GiftCodeValidator(zuoraLookupService)

    RedemptionCode(inputCode)
      .leftMap(_ => Future.successful(CodeMalformed))
      .map {
        redemptionCode =>
          for {
            giftValidationResult <- giftValidator.validate(redemptionCode, None)
            mergedResult <- if (giftValidationResult == CodeNotFound)
              corporateValidator.validate(redemptionCode)
            else
              Future.successful(giftValidationResult)
          } yield mergedResult
      }.merge
  }

}
