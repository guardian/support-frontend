package com.gu.support.redemption.generator

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class GiftGeneratorSpec extends AnyFlatSpec with Matchers {

  it should "work in the basic case" in {
    val giftCode = GiftGenerator(Iterator.continually(0)).take(1).toList.head(GiftDuration.Gift3Month)
    giftCode.value should be("gd03-000000")
  }

  it should "always produce different codes with the built in random" in {
    val generateGiftCode = GiftGenerator.randomGiftCodes
    val giftCodes = generateGiftCode.map(_(GiftDuration.Gift3Month))
    val numberToCheck = 10000
    val duplicateCodes = giftCodes.take(numberToCheck).toList.groupBy(identity).collect {
      case (code, list) if list.length > 1 => (code, list.length)
    }.toList
    duplicateCodes should be(List())
  }

}

class ConstructCodeSpec  extends AnyFlatSpec with Matchers {

  it should "get the durations right for the codes" in {
    ConstructCode(IntsToTypableString.Code("000000").get)(GiftDuration.Gift3Month).value should be("gd03-000000")
    ConstructCode(IntsToTypableString.Code("000000").get)(GiftDuration.Gift6Month).value should be("gd06-000000")
    ConstructCode(IntsToTypableString.Code("000000").get)(GiftDuration.Gift12Month).value should be("gd12-000000")
  }

}

class IntsToTypableStringSpec extends AnyFlatSpec with Matchers {

  it should "extreme values" in {
    IntsToTypableString(Iterator.continually(0)).take(1).toList.head.value should be("000000")
    IntsToTypableString(Iterator.continually(-1)).take(1).toList.head.value should be("yyyyyy")
    IntsToTypableString(Iterator.continually(34)).take(1).toList.head.value should be("000000")
    IntsToTypableString(Iterator.continually(Int.MaxValue)).take(1).toList.head.value should be("pppppp")
    IntsToTypableString(Iterator.continually(Int.MinValue)).take(1).toList.head.value should be("qqqqqq")
  }

  it should "cycle through all the possiblities" in {
    val seq = Stream.from(0).iterator
    IntsToTypableString(seq).take(7).toList.map(_.value) should be(
      List("0y2345", "6789ab", "cdefgh", "ijkzmn", "opqrst", "uvwx0y", "234567")
    )
  }

}
