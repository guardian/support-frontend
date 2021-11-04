package controllers

import java.util.Locale

import actions.CustomActionBuilders
import actions.CustomActionBuilders.{AuthRequest, OptionalAuthRequest}
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.{EitherT, OptionT}
import cats.implicits._
import com.gu.identity.model.{User => IdUser}
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.redemption.corporate.{CorporateCodeValidator, DynamoTableAsync, DynamoTableAsyncProvider}
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

class RedemptionController(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  membersDataService: MembersDataService,
  testUsers: TestUserService,
  components: ControllerComponents,
  dynamoTableProvider: DynamoTableAsyncProvider,
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


  def displayForm(redemptionCode: RawRedemptionCode): Action[AnyContent] = maybeAuthenticatedAction().async {
    implicit request =>
      val futureMaybeUser = (for {
        minimalUser <- OptionT.fromOption[Future](request.user.map(_.minimalUser))
        fullUser <- identityService.getUser(minimalUser).toOption
      } yield fullUser).value

      val isTestUser = testUsers.isTestUser(request)
      val codeValidator = new CodeValidator(zuoraLookupServiceProvider.forUser(isTestUser), dynamoTableProvider.forUser(isTestUser))
      val normalisedCode = redemptionCode.toLowerCase(Locale.UK)
      for {
        maybeUser <- futureMaybeUser
        form <- codeValidator.validate(redemptionCode).value.map(
          validationResult =>
            Ok(subscriptionRedemptionForm(
              title = title,
              mainElement = id,
              js = js,
              css = css,
              csrf = None,
              isTestUser = isTestUser,
              stage = "checkout",
              redemptionCode = normalisedCode,
              maybeReaderType = validationResult.toOption,
              maybeRedemptionError = validationResult.left.toOption,
              user = maybeUser,
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

  def displayError(redemptionCode: RawRedemptionCode, error: String, isTestUser: Boolean)(implicit request: OptionalAuthRequest[Any]): Result = {
    SafeLogger.error(scrub"An error occurred while trying to process redemption code - ${redemptionCode}. Error was - ${error}")
    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
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
    maybeAuthenticatedAction(subscriptionsClientId).async { implicit request =>
      tryToShowProcessingPage(redemptionCode)
    }

  private def tryToShowProcessingPage(redemptionCode: RawRedemptionCode)(implicit request: OptionalAuthRequest[Any]) = {
    val isTestUser = testUsers.isTestUser(request)
    val codeValidator = new CodeValidator(zuoraLookupServiceProvider.forUser(isTestUser), dynamoTableProvider.forUser(isTestUser))
    val maybeProcessingPage = request.user match {
      case Some(user) => for {
          authedUser <- identityService.getUser(user.minimalUser).leftMap((_, false))
          readerType <- codeValidator.validate(redemptionCode).leftMap((_, isTestUser))
        } yield showProcessing(redemptionCode, readerType, Some(authedUser))
      case _ => {
        codeValidator.validate(redemptionCode).map(readerType => showProcessing(redemptionCode, readerType, None)).leftMap((_, isTestUser))
      }
    }

    maybeProcessingPage.leftMap {
      case (error, isTestUser) => displayError(redemptionCode, error, isTestUser)
    }.merge
  }

  private def showProcessing(
    redemptionCode: RawRedemptionCode,
    readerType: ReaderType,
    user: Option[IdUser]
  )(implicit request: OptionalAuthRequest[Any]): Result =
    Ok(subscriptionRedemptionForm(
      title = title,
      mainElement = id,
      js = js,
      css = css,
      csrf = Some(CSRF.getToken.value),
      isTestUser = testUsers.isTestUser(request),
      stage = "processing",
      redemptionCode = redemptionCode,
      maybeRedemptionError = None,
      maybeReaderType = Some(readerType),
      user = user,
      submitted = true
    ))

  def validateCode(redemptionCode: RawRedemptionCode, isTestUser: Option[Boolean]): Action[AnyContent] = CachedAction().async {
    val testUser = isTestUser.getOrElse(false)
    val codeValidator = new CodeValidator(zuoraLookupServiceProvider.forUser(testUser), dynamoTableProvider.forUser(testUser))
    codeValidator.validate(redemptionCode).value.map {
      validationResult =>
      SafeLogger.info(s"Validating code ${redemptionCode}: ${validationResult}")
      Ok(RedemptionValidationResult(
        valid = validationResult.isRight,
        readerType = validationResult.toOption,
        errorMessage = validationResult.left.toOption).asJson
      )
    }
  }

  def redirect(redemptionCode: RawRedemptionCode): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(routes.RedemptionController.displayForm(redemptionCode).url, request.queryString, status = MOVED_PERMANENTLY)
  }
}

class CodeValidator(zuoraLookupService: ZuoraGiftLookupService, dynamoTableAsync: DynamoTableAsync) {

  def validate(inputCode: String)(implicit ec: ExecutionContext): EitherT[Future, String, ReaderType] =
    EitherT(getValidationResult(inputCode).map {
      case ValidCorporateCode(_) => Right(Corporate)
      case ValidGiftCode(_) => Right(Gift)
      case CodeAlreadyUsed => Left("This code has already been redeemed")
      case CodeExpired => Left("This code has expired")
      case _: InvalidCode | CodeNotFound | _: CodeRedeemedInThisRequest => Left("Please check the code and try again")
    })

  private def getValidationResult(inputCode: String)(implicit ec: ExecutionContext): Future[CodeStatus] = {
    val corporateValidator = CorporateCodeValidator.withDynamoLookup(dynamoTableAsync)
    val giftValidator = new GiftCodeValidator(zuoraLookupService)

    RedemptionCode(inputCode)
      .leftMap(_ => Future.successful(CodeMalformed))
      .map {
        redemptionCode =>
          for {
            giftValidationResult <- giftValidator.getStatus(redemptionCode, None)
            mergedResult <- if (giftValidationResult == CodeNotFound)
              corporateValidator.getStatus(redemptionCode)
            else
              Future.successful(giftValidationResult)
          } yield mergedResult
      }.merge
  }

}
