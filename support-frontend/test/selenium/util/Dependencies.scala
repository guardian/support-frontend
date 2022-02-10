package selenium.util

import okhttp3.OkHttpClient
import okhttp3.Request.Builder

object Dependencies {

  private val client = new OkHttpClient()

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
