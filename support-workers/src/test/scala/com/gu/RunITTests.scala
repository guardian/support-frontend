package com.gu

import org.scalatest.Reporter
import org.scalatest.events.Event
import org.scalatest.tools.Runner

object RunITTests {

  def main(args: Array[String]): Unit = {
    apply()
  }

  // Referenced in Cloudformation
  def apply(): Unit = {
    val a: Array[String] = Array(
      "-R", "support-workers/target/scala-2.12/support-workers-it.jar",
      "-e",
      "-C", "com.gu.ITTestReporter"
    )
    Runner.main(a)
  }

}

class ITTestReporter extends Reporter {
  override def apply(event: Event): Unit = {
    println(s"event: $event") // send to cloudwatch
  }
}
