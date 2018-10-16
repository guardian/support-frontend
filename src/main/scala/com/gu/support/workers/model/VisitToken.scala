package com.gu.support.workers.model

sealed trait ReadAccess
case class ReadAccessByVisitToken(value: String) extends ReadAccess
case object ReadAccessByIdentityId extends ReadAccess
