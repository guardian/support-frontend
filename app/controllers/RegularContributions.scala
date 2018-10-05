package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.OptionalAuthRequest
import assets.AssetsResolver
import cats.implicits._
import codecs.CirceDecoders.statusEncoder
import com.gu.identity.play.{AccessCredentials, AuthenticatedIdUser, IdMinimalUser, IdUser}
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.workers.model.User
import cookies.RecurringContributionCookie
import io.circe.syntax._
import lib.PlayImplicits._
import monitoring.SafeLogger
import monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.MembersDataService.UserNotFound
import services.stepfunctions.{CreateRegularContributorRequest, RegularContributionsClient, StatusResponse}
import services.{IdentityService, MembersDataService, TestUserService}
import admin.{Settings, SettingsProvider, SettingsSurrogateKeySyntax}
import config.Configuration.GuardianDomain
import views.html.recurringContributions

import scala.concurrent.{ExecutionContext, Future}

class RegularContributions(
    client: RegularContributionsClient,
    val assets: AssetsResolver,
    actionRefiners: CustomActionBuilders,
    membersDataService: MembersDataService,
    identityService: IdentityService,
    testUsers: TestUserService,
    stripeConfigProvider: StripeConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    components: ControllerComponents,
    guardianDomain: GuardianDomain,
    settingsProvider: SettingsProvider
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def monthlyContributionsPage(maybeUser: Option[IdUser], uatMode: Boolean)(implicit request: RequestHeader, settings: Settings): Result = {
    Ok(recurringContributions(
      title = "Support the Guardian | Recurring Contributions",
      id = "regular-contributions-page",
      js = "regularContributionsPage.js",
      css = "regularContributionsPageStyles.css",
      user = maybeUser,
      uatMode,
      defaultStripeConfig = stripeConfigProvider.get(false),
      uatStripeConfig = stripeConfigProvider.get(true),
      payPalConfig = payPalConfigProvider.get(uatMode)
    ))
  }

  private def displayFormWithUser(user: AuthenticatedIdUser)(implicit request: RequestHeader, settings: Settings): Future[Result] =
    identityService.getUser(user).semiflatMap { fullUser =>
      isRegularContributor(user.credentials) map {
        case Some(true) =>
          SafeLogger.info(s"Determined that ${user.id} is already a contributor; re-directing to /contribute/recurring/existing")
          Redirect("/contribute/recurring/existing")
        case Some(false) | None =>
          val uatMode = testUsers.isTestUser(fullUser.publicFields.displayName)
          monthlyContributionsPage(Some(fullUser), uatMode)
      }
    }.valueOr { error =>
      SafeLogger.error(scrub"Failed to display recurring contributions form for ${user.id} due to error from identityService: $error")
      InternalServerError
    }

  private def displayFormWithoutUser()(implicit request: OptionalAuthRequest[AnyContent], settings: Settings): Future[Result] = {
    val uatMode = testUsers.isTestUser(request)
    Future.successful(
      monthlyContributionsPage(None, uatMode)
    )
  }

  def displayFormAuthenticated(): Action[AnyContent] =
    authenticatedAction(recurringIdentityClientId).async { implicit request =>
      implicit val settings: Settings = settingsProvider.settings()
      displayFormWithUser(request.user).map(_.withSettingsSurrogateKey)
    }

  def displayFormMaybeAuthenticated(): Action[AnyContent] =
    maybeAuthenticatedAction(recurringIdentityClientId).async { implicit request =>
      implicit val settings: Settings = settingsProvider.settings()
      request.user.fold(displayFormWithoutUser())(displayFormWithUser).map(_.withSettingsSurrogateKey)
    }

  def status(jobId: String): Action[AnyContent] = maybeAuthenticatedAction().async { implicit request =>
    client.status(jobId, request.uuid).fold(
      { error =>
        SafeLogger.error(scrub"Failed to get status of step function execution for job ${jobId} due to $error")
        InternalServerError
      },
      response => Ok(response.asJson)
    )
  }

  def create: Action[CreateRegularContributorRequest] = maybeAuthenticatedAction().async(circe.json[CreateRegularContributorRequest]) {
    implicit request =>
      request.user.fold {
        createContributorAndUser()
      } { fullUser =>
        createContributorWithUser(fullUser)
      }
  }

  private def createContributorWithUser(fullUser: AuthenticatedIdUser)(implicit request: OptionalAuthRequest[CreateRegularContributorRequest]) = {
    SafeLogger.info(s"[${request.uuid}] User ${fullUser.id} is attempting to create a new ${request.body.contribution.billingPeriod} contribution")

    val result = for {
      user <- identityService.getUser(fullUser)
      response <- client.createContributor(request.body, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield response

    result.fold(
      { error =>
        SafeLogger.error(scrub"Failed to create new ${request.body.contribution.billingPeriod} contribution for ${fullUser.id}, due to $error")
        InternalServerError
      },
      response =>
        Accepted(response.asJson)
          .withCookies(RecurringContributionCookie.create(guardianDomain, request.body.contribution.billingPeriod))
    )

  }

  private def createContributorAndUser()(implicit request: OptionalAuthRequest[CreateRegularContributorRequest]) = {
    val result = for {
      userIdWithOptionalToken <- identityService.getOrCreateUserIdFromEmail(request.body.email)
      user <- identityService.getUser(IdMinimalUser(userIdWithOptionalToken.userId, None))
      response <- client.createContributor(request.body, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield StatusResponse.fromStatusResponseAndToken(response, userIdWithOptionalToken.guestAccountRegistrationToken)

    result.fold(
      { error =>
        SafeLogger.error(scrub"Failed to create new ${request.body.contribution.billingPeriod} contribution for ${request.body.email}, due to $error")
        InternalServerError
      },
      response => {
        Accepted(response.asJson)
          .withCookies(RecurringContributionCookie.create(guardianDomain, request.body.contribution.billingPeriod))
      }

    )
  }

  private def contributor(user: IdUser, request: CreateRegularContributorRequest) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      firstName = request.firstName,
      lastName = request.lastName,
      country = request.country,
      state = request.state,
      allowMembershipMail = false,
      allowThirdPartyMail = user.statusFields.flatMap(_.receive3rdPartyMarketing).getOrElse(false),
      allowGURelatedMail = user.statusFields.flatMap(_.receiveGnmMarketing).getOrElse(false),
      isTestUser = testUsers.isTestUser(user.publicFields.displayName)
    )
  }

  private def isRegularContributor(credentials: AccessCredentials) = credentials match {
    case cookies: AccessCredentials.Cookies =>
      membersDataService.userAttributes(cookies).fold(
        {
          case UserNotFound => Some(false)
          case error =>
            SafeLogger.warn(s"Failed to fetch user attributes due to an error from members-data-api: $error")
            None
        },
        { response => Some(response.contentAccess.recurringContributor) }
      ).recover {
          case throwable @ _ =>
            SafeLogger.warn(s"Failed to fetch user attributes from members-data-api due to a failed Future: ${throwable.getCause}")
            None
        }
    case _ => Future.successful(None)
  }

}
