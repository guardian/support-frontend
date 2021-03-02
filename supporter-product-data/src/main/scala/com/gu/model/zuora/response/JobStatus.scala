package com.gu.model.zuora.response

import io.circe.Decoder

sealed abstract class JobStatus(val value: String)

object JobStatus {
  implicit val decoder: Decoder[JobStatus] = Decoder.decodeString.emap(fromString)

  def fromString(str: String): Either[String, JobStatus] =
    List(Submitted, Executing, Completed, Aborted, Error)
      .find(_.value == str)
      .toRight(s"Unknown job status $str")

  case object Submitted extends JobStatus("submitted")

  case object Executing extends JobStatus("executing")

  case object Completed extends JobStatus("completed")

  case object Aborted extends JobStatus("aborted")

  case object Error extends JobStatus("error")

}
