package selenium.util

import okhttp3.Request.Builder
import okhttp3.{Cookie, CookieJar, HttpUrl, OkHttpClient}

import scala.collection.mutable

object Dependencies {

  private val client = {

    // Keep cookies so that auth flow works
    val cookieJar = new CookieJar {
      val cookieStore = new mutable.HashMap[String, java.util.List[Cookie]]()

      override def saveFromResponse(url: HttpUrl, cookies: java.util.List[Cookie]): Unit =
        cookieStore.put(url.host(), cookies)

      override def loadForRequest(url: HttpUrl): java.util.List[Cookie] =
        cookieStore.getOrElse(url.host(), new java.util.ArrayList[Cookie]())
    }

    new OkHttpClient()
      .newBuilder()
      .cookieJar(cookieJar)
      .build()
  }

  trait Availability {
    val url: String
    def isAvailable: Boolean = {
      val request = new Builder().url(url).build()
      client.newCall(request).execute.isSuccessful
    }
  }

  object SupportFrontend extends Availability {
    val url = s"${Config.supportFrontendUrl}"
  }

  def dependencyCheck: Unit = {
    assume(
      SupportFrontend.isAvailable,
      s"${Dependencies.SupportFrontend.url} is unavailable! Please run support-frontend locally before running these tests.",
    )
  }

}
