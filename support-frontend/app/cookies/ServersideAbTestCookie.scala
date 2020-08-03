package cookies

import admin.ServersideAbTest
import admin.ServersideAbTest.Participation
import config.Configuration.GuardianDomain
import play.api.mvc.{Cookie, RequestHeader, Result}

object ServersideAbTestCookie {
  val name = "GU_mvt_id"

  def create(domain: GuardianDomain, participation: ServersideAbTest.Participation): Cookie = Cookie(
    name = name,
    value = participation.toString,
    secure = true,
    httpOnly = false,
    domain = Some(s"support${domain.value}")
  )

  def exists(request: RequestHeader): Boolean = request.cookies.exists(_.name == name)
  def get(request: RequestHeader): Option[Cookie] = request.cookies.get(name)

  def addTo(result: Result, domain: GuardianDomain, participation: Participation): Result =
    result.withCookies(create(domain, participation))
}

trait ServersideAbTestCookie {

  implicit class ResultSyntax(result: Result){
//    def withServersideAbTestCookie(
//      request: RequestHeader,
//      participation: ServersideAbTest.Participation,
//      domain: GuardianDomain
//    ): Result = {
//      // Don't overwrite the cookie if we had one in the request
//      if (!ServersideAbTestCookie.exists(request)) {
//        ServersideAbTestCookie.addTo(result, domain, participation)
//      } else {
//        result
//      }
//    }
  }
}

