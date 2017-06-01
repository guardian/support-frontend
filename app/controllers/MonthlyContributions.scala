package controllers

import lib.actions.PrivateAction
import lib.stepfunctions.MonthlyContributionsClient
import lib.stepfunctions.MonthlyContributionsClient._
import play.api.mvc.{Action, Controller}
import io.circe.generic.auto._
import play.api.libs.circe.Circe
import scala.concurrent.ExecutionContext
import codecs.CirceDecoders._
import cats.implicits._

class MonthlyContributions(client: MonthlyContributionsClient)(implicit exec: ExecutionContext) extends Controller with Circe {

  def create: Action[CreateMonthlyContributorRequest] = PrivateAction.async(circe.json[CreateMonthlyContributorRequest]) { implicit request =>
    client.createContributor(request.body).fold(
      { _ => InternalServerError },
      { _ => Accepted }
    )
  }
}
