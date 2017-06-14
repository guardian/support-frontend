package controllers

import lib.actions.ActionRefiners
import lib.stepfunctions.{CreateMonthlyContributorRequest, MonthlyContributionsClient}
import play.api.mvc.{Action, Controller}
import play.api.libs.circe.Circe

import scala.concurrent.ExecutionContext
import cats.implicits._
import com.gu.identity.play.IdUser
import lib.PlayImplicits._
import services.IdentityService
import com.gu.support.workers.model.User
import com.typesafe.scalalogging.LazyLogging

import lib.TestUsers

class MonthlyContributions(
    implicit
    client: MonthlyContributionsClient,
    actionRefiners: ActionRefiners,
    exec: ExecutionContext,
    identityService: IdentityService,
    testUsers: TestUsers
) extends Controller with Circe with LazyLogging {

  import actionRefiners._

  def create: Action[CreateMonthlyContributorRequest] = AuthenticatedAction.async(circe.json[CreateMonthlyContributorRequest]) { implicit request =>
    logger.info(s"[${request.uuid}] User ${request.user.id} is attempting to create a new monthly contribution")

    val result = for {
      user <- identityService.getUser(request.user)
      response <- client.createContributor(request.body, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield response

    result.fold(
      { error =>
        logger.error(s"Failed to create new monthly contributor: $error")
        InternalServerError
      },
      _ => Accepted
    )
  }

  private def contributor(user: IdUser, request: CreateMonthlyContributorRequest) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      firstName = request.firstName,
      lastName = request.lastName,
      country = request.country,
      allowMembershipMail = true,
      allowThirdPartyMail = user.statusFields.flatMap(_.receive3rdPartyMarketing).getOrElse(false),
      allowGURelatedMail = user.statusFields.flatMap(_.receiveGnmMarketing).getOrElse(false),
      isTestUser = testUsers.isTestUser(user.publicFields.displayName)
    )
  }
}
