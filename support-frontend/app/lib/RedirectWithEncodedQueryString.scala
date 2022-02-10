package lib

import play.api.http.Status
import play.api.mvc.{Result, Results}

object RedirectWithEncodedQueryString extends Results with Status {
  // Encode the querystring parameter keys, as Play only encodes the values
  def apply(url: String, queryString: Map[String, Seq[String]] = Map.empty, status: Int = SEE_OTHER): Result = Redirect(
    url = url,
    queryStringParams = queryString.map { case (k, v) => java.net.URLEncoder.encode(k, "utf-8") -> v },
    status = status,
  )
}
