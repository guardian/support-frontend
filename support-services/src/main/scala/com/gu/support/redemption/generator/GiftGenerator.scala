package com.gu.support.redemption.generator

import java.security.SecureRandom

import eu.timepit.refined._
import eu.timepit.refined.api.{Refined, Validate}
import eu.timepit.refined.string._

object GiftGenerator {

  sealed abstract class GiftDuration(val code: String)
  object GiftDuration {
    case object Gift3Month extends GiftDuration("03")
    case object Gift6Month extends GiftDuration("06")
    case object Gift12Month extends GiftDuration("12")
  }

  private val prefix = "gd"

  private type GiftCodeRegex = MatchesRegex[W.`"""gd(03|06|12)-[a-km-z02-9]{6}"""`.T]
  type GiftCode = String Refined GiftCodeRegex

  trait GenerateGiftCode {
    def apply(duration: GiftDuration): GiftCode
  }

  val defaultRandom = {
    val gen = new SecureRandom()
    Iterator.continually(gen.nextInt())
  }

  def apply(random: Iterator[Int] = defaultRandom): GenerateGiftCode = new GenerateGiftCode {
    override def apply(duration: GiftDuration): GiftCode = {
      val init = prefix + duration.code + "-"
      refineV[GiftCodeRegex](init + IntsToTypableString(random)).right.get
    }

  }

}

object IntsToTypableString {

  type Code = String Refined CodeRegex

  private type CodeRegex = MatchesRegex[W.`"""[a-km-z02-9]{6}"""`.T]

  def apply(random: Iterator[Int]): Code = {
    val chars = random
      .map(int => java.lang.Integer.toString(int, 34).last)
      .map {
        case '1' => 'y'
        case 'l' => 'z'
        case other => other
      }

    postCondition[CodeRegex](new String(chars.take(6).toArray))

  }

  private def postCondition[P]: PostCondition[P] = new PostCondition[P]

  private class PostCondition[P] {
    def apply[T](rawResult: T)(implicit v: Validate[T, P]): T Refined P = {
      refineV[P](rawResult).right.get
    }
  }

}
