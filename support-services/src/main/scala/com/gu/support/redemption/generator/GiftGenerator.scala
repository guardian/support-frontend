package com.gu.support.redemption.generator

import java.security.SecureRandom

import com.gu.support.redemption.generator.ConstructCode.GenerateGiftCode

object GiftGenerator {

  lazy val randomGiftCodes = {
    val gen = new SecureRandom()
    val ints = Iterator.continually(gen.nextInt())
    apply(ints)
  }

  def apply(random: Iterator[Int]): Iterator[GenerateGiftCode] =
    IntsToTypableString(random).map(ConstructCode.apply)

}

sealed abstract class GiftDuration(val code: String)

object GiftDuration {

  case object Gift3Month extends GiftDuration("03")

  case object Gift6Month extends GiftDuration("06")

  case object Gift12Month extends GiftDuration("12")

}

object ConstructCode {

  private val prefix = "gd"

  case class GiftCode private(value: String) extends AnyVal

  object GiftCode {
    def apply(value: String): Option[GiftCode] =
      Some(value)
        .filter(_.matches(raw"""gd(03|06|12)-[a-km-z02-9]{6}"""))
        .map(new GiftCode(_))
  }

  trait GenerateGiftCode {
    def apply(duration: GiftDuration): GiftCode
  }

  def apply(code: IntsToTypableString.Code): GenerateGiftCode =
    (duration: GiftDuration) => {
      val init = prefix + duration.code + "-"
      GiftCode(init + code.value).get
    }

}

object IntsToTypableString {

  case class Code private(value: String) extends AnyVal
  object Code {
    def apply(value: String): Option[Code] =
      Some(value)
        .filter(_.matches(raw"""[a-km-z02-9]{6}"""))
        .map(new Code(_))
  }

  def apply(random: Iterator[Int]): Iterator[Code] = {
    random
      .map(int => java.lang.Integer.toString(int, 34).last)
      .map {
        case '1' => 'y'
        case 'l' => 'z'
        case other => other
      }
      .grouped(6)
      .map(_.toArray)
      .map(new String(_))
      .map(Code.apply)
      .map(_.get)


  }

}
