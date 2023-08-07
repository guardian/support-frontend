package selenium.util

import okhttp3.OkHttpClient
import okhttp3.Request.Builder

object Dependencies {

  private val client = new OkHttpClient()

  trait Availability {
    val url: String
    def isAvailable: Boolean = {
      // Cookie is to avoid a chain of auth redirects as this check is purely to ensure site is up
      val request = new Builder().url(url).addHeader("Cookie", "GU_SO=false").build()
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
