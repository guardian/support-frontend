package com.gu.acquisitions

import com.gu.okhttp.RequestRunners
import com.gu.support.acquisitions.ga.{GoogleAnalyticsService, GoogleAnalyticsServiceLive, GoogleAnalyticsServiceTest}

object GoogleAnalyticsServiceBuilder {

  def build(isTestService: Boolean): GoogleAnalyticsService =
    if (isTestService) {
      GoogleAnalyticsServiceTest
    } else {
      new GoogleAnalyticsServiceLive(RequestRunners.client)
    }
}
