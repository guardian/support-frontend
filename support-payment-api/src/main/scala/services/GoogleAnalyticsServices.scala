package services

import com.gu.support.acquisitions.ga.{GoogleAnalyticsService, GoogleAnalyticsServiceLive, GoogleAnalyticsServiceTest}
import model.Environment
import okhttp3.OkHttpClient

object GoogleAnalyticsServices {
  val liveService = new GoogleAnalyticsServiceLive(new OkHttpClient())

  val testService = GoogleAnalyticsServiceTest

  def apply(env: Environment): GoogleAnalyticsService = env match {
    case Environment.Live => liveService
    case Environment.Test => testService
  }
}
