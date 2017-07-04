package com.gu.monitoring

import com.amazonaws.services.cloudwatch.model.Dimension

trait ErrorMetrics extends CloudWatch {

  //Error's Dimensions
  val stepName: String
  val serviceName: String
  val errorCode: String

  val errorDimensions: Seq[Dimension] =
    Seq(new Dimension()
      .withName("StepName").withValue(stepName)
      .withName("ServiceName").withValue(serviceName)
      .withName("ErrorCode").withValue(errorCode))

  override val allDimensions: Seq[Dimension] = commonDimensions ++ errorDimensions
}