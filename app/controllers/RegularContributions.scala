package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.implicits._
import com.gu.identity.play.{AccessCredentials, IdUser}
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.workers.model.User
import lib.PlayImplicits._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.MembersDataService.UserNotFound
import services.stepfunctions.{CreateRegularContributorRequest, RegularContributionsClient}
import services.{IdentityService, MembersDataService, TestUserService}
import views.html.{monthlyContributions, thankYou}
import io.circe.syntax._
import monitoring.SafeLogger
import monitoring.SafeLogger._

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
    components: ControllerComponents
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionRefiners._

  implicit val ar = assets

  def displayForm(paypal: Option[Boolean], directDebit: Option[Boolean]): Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    identityService.getUser(request.user).semiflatMap { fullUser =>
      isMonthlyContributor(request.user.credentials) map {
        case Some(true) =>
          SafeLogger.info(s"Determined that ${request.user.id} is already a monthly contributor; re-directing to /contribute/recurring/existing")
          Redirect("/contribute/recurring/existing")
        case Some(false) | None =>
          val uatMode = testUsers.isTestUser(fullUser.publicFields.displayName)
          Ok(
            monthlyContributions(
              title = "Support the Guardian | Monthly Contributions",
              id = "regular-contributions-page",
              js = "regularContributionsPage.js",
              user = fullUser,
              uatMode = uatMode,
              payPalButton = paypal.getOrElse(true),
              directDebitButton = directDebit.getOrElse(false),
              defaultStripeConfig = stripeConfigProvider.get(false),
              uatStripeConfig = stripeConfigProvider.get(true),
              payPalConfig = payPalConfigProvider.get(uatMode)
            )
          )
      }
    } fold (
      { error =>
        SafeLogger.error(scrub"Failed to display recurring contributions form for ${request.user.id} due to error from identityService: $error")
        InternalServerError
      },
      identity
    )
  }

  def status(jobId: String): Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    client.status(jobId, request.uuid).fold(
      { error =>
        SafeLogger.error(scrub"Failed to get status of step function execution for user ${request.user.id} due to $error")
        InternalServerError
      },
      response => Ok(response.asJson)
    )
  }

  def create: Action[CreateRegularContributorRequest] = AuthenticatedAction.async(circe.json[CreateRegularContributorRequest]) { implicit request =>
    SafeLogger.info(s"[${request.uuid}] User ${request.user.id} is attempting to create a new ${request.body.contribution.billingPeriod} contribution")

    val result = for {
      user <- identityService.getUser(request.user)
      response <- client.createContributor(request.body, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield response

    result.fold(
      { error =>
        SafeLogger.error(scrub"Failed to create new ${request.body.contribution.billingPeriod} contribution for ${request.user.id}, due to $error")
        InternalServerError
      },
      response => Accepted(response.asJson)
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

  private def isMonthlyContributor(credentials: AccessCredentials) = credentials match {
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

  def regularContributionsThankYou(): Action[AnyContent] =
    AuthenticatedAction.async { implicit request =>
      import cats.implicits._

      val identityUser = identityService.getUser(request.user)

      identityUser.value.foreach({
        case Left(error) => SafeLogger.error(scrub"Failed to retrieve a user from identity. $error")
        case Right(_) =>
      })

      identityUser.toOption.value.map { maybeUser =>
        Ok(
          thankYou(
            title = "Support the Guardian | Thank You",
            id = "contributions-thank-you-page",
            js = "contributionsThankYouPage.js",
            email = maybeUser.map(_.primaryEmailAddress),
            showSubCopy = true
          )
        )
      }
    }
}
