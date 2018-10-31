package cookies

import admin.ServersideAbTest
import admin.ServersideAbTest.Participation
import config.Configuration.GuardianDomain
import play.api.mvc.{Cookie, RequestHeader, Result}

object ServersideAbTestCookie {
  val name = "gu.serverside.ab.test"

  def create(domain: GuardianDomain, participation: ServersideAbTest.Participation): Cookie = Cookie(
    name = name,
    value = participation.toString,
    secure = true,
    httpOnly = false,
    domain = Some(s"support${domain.value}")
  )

  def exists(implicit request: RequestHeader): Boolean = request.cookies.exists(_.name == name)
  def get(implicit request: RequestHeader): Option[Cookie] = request.cookies.get(name)

  def addTo(result: Result)(implicit domain: GuardianDomain, participation: Participation): Result =
    result.withCookies(create(domain, participation))
}

trait ServersideAbTestCookie {

  implicit class ResultSyntax(result: Result)(
      implicit
      request: RequestHeader,
      participation: ServersideAbTest.Participation,
      domain: GuardianDomain
  ) {
    def withServersideAbTestCookie: Result = {
      // Don't overwrite the cookie if we had one in the request
      if (!ServersideAbTestCookie.exists) {
        ServersideAbTestCookie.addTo(result)
      } else {
        result
      }
    }
  }
}

