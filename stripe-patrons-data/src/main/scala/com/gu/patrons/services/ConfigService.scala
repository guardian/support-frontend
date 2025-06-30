package com.gu.patrons.services

import com.typesafe.scalalogging.StrictLogging
import software.amazon.awssdk.services.ssm.model.Parameter

trait ConfigService extends StrictLogging {

  protected def findParameterOrThrow(name: String, params: List[Parameter]) =
    findParameterValue(name, params).getOrElse {
      val error = s"Missing config value for parameter $name"
      logger.error(error)
      throw new RuntimeException(error)
    }

  protected def findParameterValue(name: String, params: List[Parameter]) =
    params
      .find(_.name.split('/').last == name)
      .map(_.value)

}
