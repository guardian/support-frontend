package com.gu.model

sealed abstract class Stage(val value: String)

object Stage {

  case object DEV extends Stage("DEV")

  case object CODE extends Stage("CODE")

  case object PROD extends Stage("PROD")

}
