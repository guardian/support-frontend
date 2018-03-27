package com.gu.threadpools

import java.util.concurrent.Executors
import com.typesafe.scalalogging.StrictLogging
import scala.concurrent.ExecutionContext

object CustomPool extends StrictLogging {

  implicit val ec = ExecutionContext.fromExecutor(Executors.newFixedThreadPool(4))

}
