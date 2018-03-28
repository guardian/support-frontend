package com.gu.threadpools

import java.util.concurrent.Executors
import scala.concurrent.ExecutionContext

object CustomPool {

  implicit val executionContext = ExecutionContext.fromExecutor(Executors.newFixedThreadPool(4))

}
