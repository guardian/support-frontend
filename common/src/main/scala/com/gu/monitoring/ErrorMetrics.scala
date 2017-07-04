package com.gu.monitoring

import com.amazonaws.services.cloudwatch.model.Dimension

trait ErrorMetrics extends CloudWatch {

  //Error's Dimensions
  val stepName: String
  val serviceName: String
  val errorCode: String

  val errorDimension: Seq[Dimension] =
    Seq(new Dimension()
        .withName("StepName").withValue(stepName)
        .withName("ServiceName").withValue(serviceName)
        .withName("ErrorCode").withValue(errorCode))

  override def mandatoryDimensions: Seq[Dimension] = commonDimensions ++ errorDimension
}