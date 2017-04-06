package com.gu.support.lambda

import java.util.{ Map => JMap }

import com.amazonaws.services.lambda.runtime.{Context, RequestHandler}
import com.typesafe.scalalogging.LazyLogging

class CreatePaymentMethod extends RequestHandler[JMap[String, Object], Unit] with LazyLogging {

  override def handleRequest(event: JMap[String, Object], context: Context): Unit = {
  }

}
