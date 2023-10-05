package com.gu.patrons.services

import com.amazonaws.services.simplesystemsmanagement.model.Parameter
import com.gu.supporterdata.model.Stage
import com.typesafe.scalalogging.StrictLogging

trait ConfigService extends StrictLogging {

  protected def findParameterOrThrow(name: String, params: List[Parameter]) =
    findParameterValue(name, params).getOrElse {
      val error = s"Missing config value for parameter $name"
      logger.error(error)
      throw new RuntimeException(error)
    }

  protected def findParameterValue(name: String, params: List[Parameter]) =
    params
      .find(_.getName.split('/').last == name)
      .map(_.getValue)

}
