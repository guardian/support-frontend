package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.exceptions.NonFatalException
import com.gu.support.workers.helpers.Handler
import com.typesafe.scalalogging.LazyLogging

class FlakeyService extends Handler[String, Unit] with LazyLogging {

  override protected def handler(input: String, context: Context) = {
    logger.info("FlakeyService")
      if (FlakeyService.invocations == 0){
        logger.info("Throw non fatal exception")
        FlakeyService.invocations = 1
        throw NonFatalException("Should retry")
      }
  }
}

object FlakeyService{
  var invocations = 0
}
