package com.gu.acquisition.services

import com.gu.acquisition.typeclasses.AcquisitionSubmissionBuilder
import okhttp3.OkHttpClient

import scala.concurrent.ExecutionContext

class DefaultAcquisitionService(implicit client: OkHttpClient) extends AcquisitionService {
  private val ophanService = new OphanService()
  private val gAService = new GAService()
  override def submit[A: AcquisitionSubmissionBuilder](a: A)(implicit ec: ExecutionContext) = {
    ophanService.submit(a)
  }
}
