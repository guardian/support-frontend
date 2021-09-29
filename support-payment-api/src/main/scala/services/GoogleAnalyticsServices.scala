package services

import com.gu.support.acquisitions.ga.{GoogleAnalyticsService, GoogleAnalyticsServiceImpl, MockGoogleAnalyticsService}
import model.Environment
import okhttp3.OkHttpClient

object GoogleAnalyticsServices {
  val liveService = new GoogleAnalyticsServiceImpl(new OkHttpClient())

  val testService = MockGoogleAnalyticsService

  def apply(env: Environment): GoogleAnalyticsService = env match {
    case Environment.Live => liveService
    case Environment.Test => testService
  }
}
