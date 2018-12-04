package com.gu.support.catalog

import io.circe.Decoder

sealed trait Status

case object Active extends Status

case object Expired extends Status

object Status {

  implicit val decoder: Decoder[Status] = Decoder.decodeString.emap(status => Status.fromString(status).toRight(s"Unrecognized status '$status'"))

  def fromString(s: String) = s.toLowerCase match {
    case "active" => Some(Active)
    case "expired" => Some(Expired)
    case _ => None
  }

}
