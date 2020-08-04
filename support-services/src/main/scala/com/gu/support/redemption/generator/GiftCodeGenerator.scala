package com.gu.support.redemption.generator

import java.security.SecureRandom

import com.gu.support.redemption.generator.CodeBuilder.GenerateGiftCode

object GiftCodeGenerator {

  lazy val randomGiftCodes: Iterator[GenerateGiftCode] = {
    val gen = new SecureRandom()
    val ints = Iterator.continually(gen.nextInt())
    fromInts(ints)
  }

  def fromInts(random: Iterator[Int]): Iterator[GenerateGiftCode] =
    CodeSuffixGenerator.generate(random).map(CodeBuilder.build)

}

sealed abstract class GiftDuration(val code: String)

object GiftDuration {

  case object Gift3Month extends GiftDuration("03")

  case object Gift6Month extends GiftDuration("06")

  case object Gift12Month extends GiftDuration("12")

}

object CodeBuilder {

  private val prefix = "gd"

  case class GiftCode private(value: String) extends AnyVal

  object GiftCode {
    def apply(value: String): Option[GiftCode] =
      Some(value)
        .filter(_.matches(raw"""gd(03|06|12)-[a-km-z02-9]{6}"""))
        .map(new GiftCode(_))
  }

  trait GenerateGiftCode {
    def withDuration(duration: GiftDuration): GiftCode
  }

  def build(code: CodeSuffixGenerator.CodeSuffix): GenerateGiftCode =
    (duration: GiftDuration) => {
      val init = prefix + duration.code + "-"
      GiftCode(init + code.value).get
    }

}

object CodeSuffixGenerator {

  case class CodeSuffix private(value: String) extends AnyVal
  object CodeSuffix {
    def apply(value: String): Option[CodeSuffix] =
      Some(value)
        .filter(_.matches(raw"""[a-km-z02-9]{6}"""))
        .map(new CodeSuffix(_))
  }

  def generate(random: Iterator[Int]): Iterator[CodeSuffix] =
    random.grouped(6).map(codeFromGroup).map(CodeSuffix.apply).map(_.get)

  private[generator] def codeFromGroup(groupedInts: Seq[Int]): String = {
    val chars = groupedInts
      .map(int => java.lang.Integer.toString(int, 34).last)
      .map {
        case '1' => 'y'
        case 'l' => 'z'
        case other => other
      }
    new String(chars.toArray)
  }
}
