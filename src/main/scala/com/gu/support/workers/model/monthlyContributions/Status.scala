package com.gu.support.workers.model.monthlyContributions

sealed trait Status {
  def asString: String
}

object Status {
  val all = List(Success, Failure, Exception, Pending)

  def fromString(s: String): Option[Status] = all.find(_.asString == s)

  case object Success extends Status {
    override def asString = "success"
  }

  case object Failure extends Status {
    override def asString = "failure"
  }

  case object Exception extends Status {
    override def asString = "exception"
  }

  case object Pending extends Status {
    override def asString = "pending"
  }
}