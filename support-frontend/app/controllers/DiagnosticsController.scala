package controllers

import actions.CustomActionBuilders
import play.api.mvc._
import Results.Ok

class DiagnosticsController(
    actionRefiners: CustomActionBuilders,
) extends Results {

  val relevantCookies = List(
    "gu_user_features_expiry",
    "gu_paying_member",
    "GU_AF1",
    "gu_action_required_for",
    "gu_digital_subscriber",
    "gu_hide_support_messaging",
    "gu_recurring_contributor",
    "gu_one_off_contribution_date",
    "gu.contributions.recurring.contrib-timestamp.Monthly",
    "gu.contributions.recurring.contrib-timestamp.Annual",
    "gu.contributions.contrib-timestamp",
    "gu_article_count_opt_out",
    "gu_contributions_reminder_signed_up",
  )

  import actionRefiners._
  def cookies(): Action[AnyContent] = NoCacheAction() { request =>
    val cookies = request.cookies.filter { cookie =>
      relevantCookies.contains(cookie.name)
    }
    val humanReadableCookies =
      "Please make sure you are logged in and have visited https://www.theguardian.com and seen the issue," +
        " immediately before sending the information from this page" ::
        s"you have ${cookies.size} cookie(s)." ::
        cookies.map { cookie =>
          "* " + cookie.name + "\n" +
            " ( domain: " + cookie.domain + ", httpOnly: " + cookie.httpOnly + ", path: " + cookie.path + ", maxAge: " + cookie.maxAge + ", sameSite: " +
            cookie.sameSite + ", secure: " + cookie.secure + " )\n" +
            " = " + cookie.value
        }.toList
    Ok(humanReadableCookies.mkString("\n\n"))
  }

  // temp redirect so that we can use the PROD bwid in the CODE env - remove after hackdays June 2022
  def hackday(): Action[AnyContent] = NoCacheAction() { implicit request =>
    request.cookies.get("bwid").map(_.value) match {
      case Some(bwid) =>
        Redirect(
          url = "https://support.code.dev-theguardian.com/propensity",
          queryStringParams = Map("bwid" -> Seq(bwid)),
        )
      case None => Ok("You don't have a bwid cookie, so we can't check your history")
    }

  }

}
