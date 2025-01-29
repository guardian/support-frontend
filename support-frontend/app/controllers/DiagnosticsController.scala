package controllers

import actions.CustomActionBuilders
import play.api.mvc._
import Results.Ok
import play.twirl.api.Html

class DiagnosticsController(
    actionRefiners: CustomActionBuilders,
) {

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
    "GO_SO",
  )
  val privateCookies = List(
    "GU_U",
    "SC_GU_U",
  )

  import actionRefiners._
  def cookies(): Action[AnyContent] = NoCacheAction() { request =>
    val humanReadableCookies =
      "Please make sure you are logged in and have visited https://www.theguardian.com and seen the issue," +
        " immediately before sending the information from this page" ::
        request.cookies.collect {
          case cookie if relevantCookies.contains(cookie.name) =>
            "* " + cookie.name + "\n  " + cookie.value
          case cookie if privateCookies.contains(cookie.name) =>
            "* " + cookie.name + "\n  (private - length: " + cookie.value.length + ")"
        }.toList
    Ok(withHtml(humanReadableCookies.mkString("\n\n")))
  }

  def withHtml(body: String): Html = {
    val cookiesJS =
      "<pre><script>document.write(document.cookie.split('; ').map((a) => a.split('=')).map((a) => a[0] + ' ' + a[1]?.length).join('\\n'))</script></pre>"
    Html(
      s"<html><body><h2>HTTP cookies</h2><pre>$body</pre><h2>JS cookie keys and lengths</h2>$cookiesJS</body></html>",
    )
  }

}
