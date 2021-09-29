package com.gu.acquisitions

import com.gu.okhttp.RequestRunners
import com.gu.support.acquisitions.ga.{GoogleAnalyticsService, GoogleAnalyticsServiceImpl, MockGoogleAnalyticsService}

object GoogleAnalyticsServiceBuilder {

  def build(isTestService: Boolean): GoogleAnalyticsService =
    if (isTestService) {
      MockGoogleAnalyticsService
    } else {

      new GoogleAnalyticsServiceImpl(RequestRunners.client)
    }
}
