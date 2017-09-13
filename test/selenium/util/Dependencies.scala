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

  object IdentityFrontend extends Availability {
    val url = s"${Config.identityFrontendUrl}/signin"
  }

  object ContributionFrontend extends Availability {
    val url = s"${Config.contributionFrontend}"
  }
}
