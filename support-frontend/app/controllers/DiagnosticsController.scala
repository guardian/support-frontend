package controllers

import actions.CustomActionBuilders
import play.api.mvc._
import play.api.mvc.Results.Ok

class DiagnosticsController(
    actionRefiners: CustomActionBuilders,
) {

  private val relevantCookies = List(
    "gu_user_benefits_expiry",
    "GU_AF1",
    "gu_action_required_for",
    "gu_allow_reject_all",
    "gu_hide_support_messaging",
    "gu.contributions.contrib-timestamp",
    "gu_article_count_opt_out",
    "GO_SO",
  )
  private val privateCookies = List(
    "GU_U",
    "SC_GU_U",
  )

  import actionRefiners._
  def cookies(): Action[AnyContent] = NoCacheAction() { request =>
    val humanReadableCookies =
      "Please make sure you are logged in and have visited https://www.theguardian.com and seen the issue, immediately before sending the information from this page" ::
        request.cookies.collect {
          case cookie if relevantCookies.contains(cookie.name) =>
            s"""* ${cookie.name}\n  ${cookie.value}"""
          case cookie if privateCookies.contains(cookie.name) =>
            s"""* ${cookie.name}\n  (private - length: ${cookie.value.length})"""
        }.toList
    Ok(humanReadableCookies.mkString("\n\n"))
  }

}
