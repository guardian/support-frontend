package com.gu.stripeIntent

import com.amazonaws.services.s3.AmazonS3URI
import com.gu.support.config.{Stage, Stages}

object StripeConfigPath {
  def pathForStage(stage: Stage): String = stage match {
    case Stages.DEV => "test"
    case Stages.CODE => "test"
    case Stages.PROD => "live"
  }
  def apply(stage: Stage): AmazonS3URI =
    new AmazonS3URI(s"s3://gu-reader-revenue-private/stripe/${pathForStage(stage)}-stripe-regular.private.conf")
}
