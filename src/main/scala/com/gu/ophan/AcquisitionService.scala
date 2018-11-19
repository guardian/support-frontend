package com.gu.ophan

import com.gu.okhttp.RequestRunners

object AcquisitionService {

  def apply(isTestService: Boolean): com.gu.acquisition.services.AcquisitionService =
    if (isTestService) {
      com.gu.acquisition.services.MockAcquisitionService
    } else {
      com.gu.acquisition.services.AcquisitionService.prod(RequestRunners.client)
    }
}
