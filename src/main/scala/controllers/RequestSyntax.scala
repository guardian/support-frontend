package controllers

import play.api.mvc.Request

trait RequestSyntax {

  implicit class RequestOps(val request: Request[_]) {
    def countrySubdivisionCode: Option[String] = request.headers.get("GU-ISO-3166-2")
  }
}
