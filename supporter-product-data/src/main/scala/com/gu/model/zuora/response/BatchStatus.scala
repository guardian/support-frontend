package com.gu.model.zuora.response

import io.circe.Decoder

sealed abstract class BatchStatus(val value: String)

object BatchStatus {
  implicit val decoder: Decoder[BatchStatus] = Decoder.decodeString.emap(fromString)

  def fromString(str: String): Either[String, BatchStatus] =
    List(Pending, Executing, Completed, Aborted, Cancelled)
      .find(_.value == str)
      .toRight(s"Unknown batch status $str")

  case object Pending extends BatchStatus("pending")

  case object Executing extends BatchStatus("executing")

  case object Completed extends BatchStatus("completed")

  case object Aborted extends BatchStatus("aborted")

  case object Cancelled extends BatchStatus("cancelled")

}
