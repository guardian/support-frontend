package controllers

import lib.actions.ActionRefiners
import lib.stepfunctions.{CreateMonthlyContributorRequest, MonthlyContributionsClient}
import play.api.mvc.{Action, Controller}
import play.api.libs.circe.Circe
import scala.concurrent.ExecutionContext
import cats.implicits._
import lib.PlayImplicits._

class MonthlyContributions(implicit client: MonthlyContributionsClient, actionRefiners: ActionRefiners, exec: ExecutionContext) extends Controller with Circe {

  import actionRefiners._

  def create: Action[CreateMonthlyContributorRequest] = AuthenticatedAction.async(circe.json[CreateMonthlyContributorRequest]) { implicit request =>
    client.createContributor(request.body, request.uuid).fold(
      { _ => InternalServerError },
      { _ => Accepted }
    )
  }
}
