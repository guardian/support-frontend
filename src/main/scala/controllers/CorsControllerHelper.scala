package controllers

import play.api.mvc.Request

object CorsControllerHelper {

  def corsHeaders(request: Request[_], corsUrl: List[String]) = {
    val origin = request.headers.get("origin")
    val allowedOrigin = origin.filter(corsUrl.contains)
    allowedOrigin.toList.flatMap { origin =>
      List(
        "Access-Control-Allow-Origin" -> origin,
        "Access-Control-Allow-Headers" -> "Origin, Content-Type, Accept",
        "Access-Control-Allow-Credentials" -> "true"
      )
    }
  }

}
