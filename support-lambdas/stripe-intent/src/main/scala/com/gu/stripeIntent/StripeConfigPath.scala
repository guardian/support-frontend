package com.gu.stripeIntent

import com.gu.aws.AwsS3Client.S3Location
import com.gu.support.config.{Stage, Stages}

object StripeConfigPath {
  private def pathForStage(stage: Stage): String = stage match {
    case Stages.DEV => "test"
    case Stages.CODE => "test"
    case Stages.PROD => "live"
  }
  def forStage(stage: Stage): S3Location =
    S3Location("gu-reader-revenue-private", s"stripe/${pathForStage(stage)}-stripe-regular.private.conf")
}
