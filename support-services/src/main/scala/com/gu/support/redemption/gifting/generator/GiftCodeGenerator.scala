package com.gu.support.redemption.gifting.generator

import java.security.SecureRandom

import com.gu.support.redemption.gifting.generator.CodeBuilder.GenerateGiftCode
import com.gu.support.workers.{Annual, BillingPeriod, GeneratedGiftCode, Quarterly}

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

  trait GenerateGiftCode {
    def withDuration(duration: GiftDuration): GeneratedGiftCode
  }

  def build(code: CodeSuffixGenerator.CodeSuffix): GenerateGiftCode =
    (duration: GiftDuration) => {
      val init = prefix + duration.code + "-"
      GeneratedGiftCode(init + code.value).get
    }

}

object CodeSuffixGenerator {

  case class CodeSuffix private (value: String) extends AnyVal
  object CodeSuffix {
    def apply(value: String): Option[CodeSuffix] =
      Some(value)
        .filter(_.matches(raw"""[a-km-z02-9]{8}"""))
        .map(new CodeSuffix(_))
  }

  def generate(random: Iterator[Int]): Iterator[CodeSuffix] =
    random.grouped(8).map(codeFromGroup).map(CodeSuffix.apply).map(_.get)

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
