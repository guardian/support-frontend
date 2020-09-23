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
import com.gu.support.redemption.corporate.{CorporateCodeValidator, DynamoLookup, DynamoTableAsync}
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemption.{CodeAlreadyUsed, CodeExpired, CodeNotFound, CodeValidationResult, ValidCorporateCode, ValidGiftCode}
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.redemptions.redemptions.RawRedemptionCode
import com.gu.zuora.{ZuoraService, ZuoraServiceProvider}
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
  zuoraServiceProvider: ZuoraServiceProvider
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
        codeValidator = new CodeValidator(zuoraServiceProvider.forUser(isTestUser), dynamoLookup)
        normalisedCode = redemptionCode.toUpperCase(Locale.UK)
        form <- codeValidator.validate(redemptionCode, isTestUser).map(
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
      Html(
        s"""
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
      Some("Unfortunately we were unable to process your code, please try again later"), //TODO: RB use actual error?
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
      codeValidator = new CodeValidator(zuoraServiceProvider.forUser(isTestUser), dynamoLookup)
      _ <- EitherT(codeValidator.validate(redemptionCode, isTestUser).map { //TODO: RB got to be a simpler way to do this
        case Some(error) => Left(error, isTestUser)
        case None => Right(())
      })
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
    val testUser = isTestUser.getOrElse(false)
    val codeValidator = new CodeValidator(zuoraServiceProvider.forUser(testUser), dynamoLookup)
    codeValidator.validate(redemptionCode, testUser).map(
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

class CodeValidator(zuoraService: ZuoraService, dynamoLookup: DynamoTableAsyncForUser) {
  def validate(inputCode: String, isTestUser: Boolean)(implicit ec: ExecutionContext): Future[Option[String]] = {
    val corporateValidator = CorporateCodeValidator.withDynamoLookup(dynamoLookup(isTestUser))
    val giftValidator = new GiftCodeValidator(zuoraService)

    RedemptionCode(inputCode)
      .leftMap(_ => "Please check the code and try again")
      .map {
        redemptionCode =>
          for {
            corporateValidationResult <- corporateValidator.validate(redemptionCode)
            giftValidationResult <- giftValidator.validate(redemptionCode, "")

          } yield validationResultToErrorMessage(merge(giftValidationResult, corporateValidationResult))
      }.fold(
      codeParsingError => Future.successful(Some(codeParsingError)),
      validationResult => validationResult
    )
  }

  def merge(giftResult: CodeValidationResult, corporateResult: CodeValidationResult) =
    if (giftResult == CodeNotFound) corporateResult else giftResult

  def validationResultToErrorMessage(validationResult: CodeValidationResult) =
    validationResult match {
      case ValidGiftCode(_) => None
      case ValidCorporateCode(_) => None
      case CodeAlreadyUsed => Some("This code has already been redeemed")
      case CodeExpired => Some("This code has expired")
      case _ => Some("Please check the code and try again")
    }
}

//class GetCorporateCustomer(dynamoLookup: DynamoTableAsyncForUser) {
//
//  def apply(redemptionCode: String, isTestUser: Boolean)(implicit ec: ExecutionContext): EitherT[Future, String, Unit] = {
//    val codeValidator = CorporateCodeValidator.withDynamoLookup(dynamoLookup(isTestUser))
//
//    for {
//      codeToCheck <- EitherT.fromEither[Future](RedemptionCode(redemptionCode)).leftMap(_ => "Please check the code and try again")
//      _ <- EitherT(codeValidator.validate(codeToCheck).map {
//        case ValidCorporateCode(_) => Right(())
//        case CodeAlreadyUsed => Left("This code has already been redeemed")
//        case CodeExpired => Left("This code has expired")
//        case _ => Left("Please check the code and try again")
//      })
//    } yield ()
//  }
//
//}
//
//object GetGiftCodeState {
//  def verify(inputCode: String, zuoraService: ZuoraService)(implicit ec: ExecutionContext): EitherT[Future, String, Unit] = {
//    val codeValidator = new GiftCodeValidator(zuoraService)
//    for {
//      codeToCheck <- EitherT.fromEither[Future](RedemptionCode(inputCode)).leftMap(_ => "Please check the code and try again")
//
//      _ <- EitherT(codeValidator.validate(codeToCheck, "").map {
//        case ValidGiftCode(_) => Right(())
//        case CodeAlreadyUsed => Left("This code has already been redeemed")
//        case CodeExpired => Left("This code has expired")
//        case _ => Left("Please check the code and try again")
//      })
//    } yield ()
//  }
//
//}

