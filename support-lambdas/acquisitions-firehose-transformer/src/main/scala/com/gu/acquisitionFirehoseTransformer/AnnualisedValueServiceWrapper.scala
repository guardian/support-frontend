package com.gu.acquisitionFirehoseTransformer

import com.gu.acquisitionsValueCalculatorClient.model.AcquisitionModel
import scala.concurrent.ExecutionContext
import com.gu.acquisitionsValueCalculatorClient.service.AnnualisedValueService

trait AnnualisedValueServiceWrapper {
  def getAV(acquisitionModel: AcquisitionModel, accountName: String)(implicit
      executionContext: ExecutionContext,
  ): Either[String, Double]
}

class AnnualisedValueServiceImpl() extends AnnualisedValueService with AnnualisedValueServiceWrapper
