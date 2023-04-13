package com.gu.supporterdata.model

sealed abstract class Stage(val value: String)

object Stage {

  case object DEV extends Stage("DEV")

  case object PROD extends Stage("PROD")

}
