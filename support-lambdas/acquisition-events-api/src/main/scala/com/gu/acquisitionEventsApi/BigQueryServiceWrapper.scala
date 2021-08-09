package com.gu.acquisitionEventsApi

import cats.data.EitherT
import com.gu.support.acquisitions.{BigQueryConfig, BigQueryService}
import com.gu.support.acquisitions.models.AcquisitionDataRow
import com.gu.support.acquisitions.utils.Retry

import scala.concurrent.{ExecutionContext, Future}

trait BigQueryServiceWrapper {
  def tableInsertRowWithRetry(acquisitionDataRow: AcquisitionDataRow, maxRetries: Int)(implicit executionContext: ExecutionContext): EitherT[Future, List[String], Unit]
}

class BigQueryServiceImpl(config: BigQueryConfig) extends BigQueryService(config) with BigQueryServiceWrapper
