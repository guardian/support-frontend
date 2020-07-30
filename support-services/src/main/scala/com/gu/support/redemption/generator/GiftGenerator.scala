package com.gu.support.redemption.generator

import java.security.SecureRandom

object GiftGenerator {

  sealed abstract class GiftDuration(val code: String)
  object GiftDuration {
    case object Gift3Month extends GiftDuration("03")
    case object Gift6Month extends GiftDuration("06")
    case object Gift12Month extends GiftDuration("12")
  }

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

  val defaultRandom = {
    val gen = new SecureRandom()
    Iterator.continually(gen.nextInt())
  }

  def apply(random: Iterator[Int] = defaultRandom): GenerateGiftCode = new GenerateGiftCode {
    override def apply(duration: GiftDuration): GiftCode = {
      val init = prefix + duration.code + "-"
      GiftCode(init + IntsToTypableString(random).value).get
    }

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

  def apply(random: Iterator[Int]): Code = {
    val chars = random
      .map(int => java.lang.Integer.toString(int, 34).last)
      .map {
        case '1' => 'y'
        case 'l' => 'z'
        case other => other
      }

    Code(new String(chars.take(6).toArray)).get

  }

}
