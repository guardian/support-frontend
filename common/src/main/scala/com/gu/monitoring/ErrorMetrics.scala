package com.gu.monitoring

import com.amazonaws.services.cloudwatch.model.Dimension

trait ErrorMetrics extends CloudWatch {

  //Error's Dimensions
  val stepName: String
  val serviceName: String
  val errorCode: String

  val errorDimensions: Seq[Dimension] = Seq(
    new Dimension().withName("StepName").withValue(stepName),
    new Dimension().withName("ServiceName").withValue(serviceName),
    new Dimension().withName("ErrorCode").withValue(errorCode))

  override val allDimensions: Seq[Dimension] = commonDimensions ++ errorDimensions
}