package com.gu.support.workers

import io.circe.{Decoder, Encoder}

sealed trait Status {
  def asString: String
}

object Status {
  val all = List(Success, Failure, Pending)

  def fromString(s: String): Option[Status] = all.find(_.asString == s)

  case object Success extends Status {
    override def asString: String = "success"
  }

  case object Failure extends Status {
    override def asString: String = "failure"
  }

  case object Pending extends Status {
    override def asString: String = "pending"
  }

  implicit val encodeStatus: Encoder[Status] = Encoder.encodeString.contramap[Status](_.asString)

  implicit val decodeStatus: Decoder[Status] = Decoder.decodeString.emap { identifier =>
    Status.fromString(identifier).toRight(s"Unrecognised status '$identifier'")
  }
}
