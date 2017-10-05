package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import cats.implicits._
import com.gu.identity.play.{AccessCredentials, IdUser}
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.workers.model.User
import com.typesafe.scalalogging.LazyLogging
import lib.PlayImplicits._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.MembersDataService.UserNotFound
import services.stepfunctions.{CreateRegularContributorRequest, RegularContributionsClient}
import services.{IdentityService, MembersDataService, TestUserService}
import views.html.monthlyContributions
import io.circe.syntax._

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
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

  import actionRefiners._

  implicit val ar = assets

  def displayForm(paypal: Option[Boolean]): Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    identityService.getUser(request.user).semiflatMap { fullUser =>
      isMonthlyContributor(request.user.credentials) map {
        case Some(true) => Redirect("/contribute/recurring/existing")
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
              defaultStripeConfig = stripeConfigProvider.get(false),
              uatStripeConfig = stripeConfigProvider.get(true),
              payPalConfig = payPalConfigProvider.get(uatMode)
            )
          )
      }
    } getOrElse InternalServerError
  }

  def status(jobId: String): Action[AnyContent] = AuthenticatedAction.async { implicit request =>
    client.status(jobId, request.uuid).fold(
      { error =>
        logger.error(s"Failed to get status: $error")
        InternalServerError
      },
      response => Ok(response.asJson)
    )
  }

  def create: Action[CreateRegularContributorRequest] = AuthenticatedAction.async(circe.json[CreateRegularContributorRequest]) { implicit request =>
    logger.info(s"[${request.uuid}] User ${request.user.id} is attempting to create a new ${request.body.contribution.billingPeriod} contribution")

    val result = for {
      user <- identityService.getUser(request.user)
      response <- client.createContributor(request.body, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield response

    result.fold(
      { error =>
        logger.error(s"Failed to create new monthly contributor: $error")
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
            logger.error(s"Failed to fetch user attributes from members data service: $error")
            None
        },
        { response => Some(response.contentAccess.recurringContributor) }
      )
    case _ => Future.successful(None)
  }
}
