package com.gu.supporterdata.model

sealed abstract class Stage(val value: String)

object Stage {

  case object CODE extends Stage("CODE")

  case object PROD extends Stage("PROD")

}
