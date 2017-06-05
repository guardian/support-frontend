package controllers

import lib.actions.PrivateAction
import lib.stepfunctions.{CreateMonthlyContributorRequest, MonthlyContributionsClient}
import play.api.mvc.{Action, Controller}
import play.api.libs.circe.Circe
import scala.concurrent.ExecutionContext
import cats.implicits._
import lib.PlayImplicits._

class MonthlyContributions(client: MonthlyContributionsClient)(implicit exec: ExecutionContext) extends Controller with Circe {

  def create: Action[CreateMonthlyContributorRequest] = PrivateAction.async(circe.json[CreateMonthlyContributorRequest]) { implicit request =>
    client.createContributor(request.body, request.uuid).fold(
      { _ => InternalServerError },
      { _ => Accepted }
    )
  }
}
