package controllers

import actions.AsyncAuthenticatedBuilder.OptionalAuthRequest
import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.AssetsResolver
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogging
import com.gu.support.redemption._
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.redemptions.RedemptionCode
import com.gu.support.redemptions.redemptions.RawRedemptionCode
import com.gu.support.zuora.api.ReaderType
import com.gu.support.zuora.api.ReaderType.Gift
import com.gu.zuora.{ZuoraGiftLookupService, ZuoraGiftLookupServiceProvider}
import io.circe.syntax._
import lib.RedirectWithEncodedQueryString
import play.api.libs.circe.Circe
import play.api.mvc._
import services.TestUserService
import views.EmptyDiv
import views.html.helper.CSRF
import views.html.subscriptionRedemptionForm

import java.util.Locale
import scala.concurrent.{ExecutionContext, Future}

class RedemptionController(
    val actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    settingsProvider: AllSettingsProvider,
    testUsers: TestUserService,
    components: ControllerComponents,
    zuoraLookupServiceProvider: ZuoraGiftLookupServiceProvider,
)(implicit
    val ec: ExecutionContext,
) extends AbstractController(components)
    with Circe
    with SafeLogging {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  implicit val settings: AllSettings = settingsProvider.getAllSettings()
  val title: String = "Support the Guardian | Redeem your code"
  val id: EmptyDiv = EmptyDiv("subscriptions-redemption-page")
  val js: String = "subscriptionsRedemptionPage.js"
  val css: String = "subscriptionsRedemptionPage.css" // TODO: Don't need this?

  def displayForm(redemptionCode: RawRedemptionCode): Action[AnyContent] = MaybeAuthenticatedAction.async {
    implicit request =>
      val isTestUser = testUsers.isTestUser(request)
      val codeValidator =
        new CodeValidator(zuoraLookupServiceProvider.forUser(isTestUser))
      val normalisedCode = redemptionCode.toLowerCase(Locale.UK)
      for {
        form <- codeValidator
          .validate(redemptionCode)
          .value
          .map(validationResult =>
            Ok(
              subscriptionRedemptionForm(
                title = title,
                mainElement = id,
                js = js,
                css = css,
                csrf = Some(CSRF.getToken.value),
                isTestUser = isTestUser,
                stage = "checkout",
                redemptionCode = normalisedCode,
                maybeReaderType = validationResult.toOption,
                maybeRedemptionError = validationResult.left.toOption,
                user = request.user,
                submitted = false,
              ),
            ),
          )
      } yield form
  }

  def displayError(redemptionCode: RawRedemptionCode, error: String, isTestUser: Boolean)(implicit
      request: OptionalAuthRequest[Any],
  ): Result = {
    logger.error(
      scrub"An error occurred while trying to process redemption code - ${redemptionCode}. Error was - ${error}",
    )
    Ok(
      subscriptionRedemptionForm(
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
        submitted = false,
      ),
    )
  }

  def validateCode(redemptionCode: RawRedemptionCode, isTestUser: Option[Boolean]): Action[AnyContent] =
    CachedAction().async {
      val testUser = isTestUser.getOrElse(false)
      val codeValidator =
        new CodeValidator(zuoraLookupServiceProvider.forUser(testUser))
      codeValidator.validate(redemptionCode).value.map { validationResult =>
        logger.info(s"Validating code ${redemptionCode}: ${validationResult}")
        Ok(
          RedemptionValidationResult(
            valid = validationResult.isRight,
            readerType = validationResult.toOption,
            errorMessage = validationResult.left.toOption,
          ).asJson,
        )
      }
    }

  def redirect(redemptionCode: RawRedemptionCode): Action[AnyContent] = CachedAction() { implicit request =>
    RedirectWithEncodedQueryString(
      routes.RedemptionController.displayForm(redemptionCode).url,
      request.queryString,
      status = MOVED_PERMANENTLY,
    )
  }
}

class CodeValidator(zuoraLookupService: ZuoraGiftLookupService) {

  def validate(inputCode: String)(implicit ec: ExecutionContext): EitherT[Future, String, ReaderType] =
    EitherT(getValidationResult(inputCode).map {
      case ValidGiftCode(_) => Right(Gift)
      case CodeAlreadyUsed => Left("This code has already been redeemed")
      case CodeExpired => Left("This code has expired")
      case _: InvalidCode | CodeNotFound | _: CodeRedeemedInThisRequest => Left("Please check the code and try again")
    })

  private def getValidationResult(inputCode: String)(implicit ec: ExecutionContext): Future[CodeStatus] = {
    val giftValidator = new GiftCodeValidator(zuoraLookupService)

    RedemptionCode(inputCode)
      .leftMap(_ => Future.successful(CodeMalformed))
      .map(redemptionCode => giftValidator.getStatus(redemptionCode, None))
      .merge
  }

}
