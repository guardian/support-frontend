package com.gu.ophan

object OphanService {

  def apply(isTestService: Boolean): com.gu.acquisition.services.OphanService =
    if (isTestService) {
      com.gu.acquisition.services.MockOphanService
    } else {
      import com.gu.akka.implicits._
      com.gu.acquisition.services.OphanService.prod
    }
}
