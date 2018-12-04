package com.gu.support.workers.model

import scala.util.Try

case class IdentityId(value: String)
object IdentityId {

  def apply(value: String): Try[IdentityId] =
    Try(value.toLong).map(_.toString).map(new IdentityId(_))

}
