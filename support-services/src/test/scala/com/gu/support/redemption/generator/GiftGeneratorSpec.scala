package com.gu.support.redemption.generator

import com.gu.support.redemption.generator.GiftGenerator.GiftDuration
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class GiftGeneratorSpec extends AnyFlatSpec with Matchers {

  it should "work in the basic case" in {
    val giftCode = GiftGenerator(Iterator.continually(0))(GiftDuration.Gift3Month)
    giftCode.value should be("gd03-000000")
  }

  it should "always produce different codes with the built in random" in {
    val generateGiftCode = GiftGenerator(GiftGenerator.defaultRandom)
    val giftCodes = Iterator.continually(generateGiftCode(GiftDuration.Gift3Month))
    val numberToCheck = 10000
    val duplicateCodes = giftCodes.take(numberToCheck).toList.groupBy(identity).collect {
      case (code, list) if list.length > 1 => (code, list.length)
    }.toList
    duplicateCodes should be(List())
  }

}

class IntsToTypableStringSpec extends AnyFlatSpec with Matchers {

  it should "extreme values" in {
    IntsToTypableString(Iterator.continually(0)).value should be("000000")
    IntsToTypableString(Iterator.continually(-1)).value should be("yyyyyy")
    IntsToTypableString(Iterator.continually(34)).value should be("000000")
    IntsToTypableString(Iterator.continually(Int.MaxValue)).value should be("pppppp")
    IntsToTypableString(Iterator.continually(Int.MinValue)).value should be("qqqqqq")
  }

  it should "cycle through all the possiblities" in {
    val seq = Stream.from(0).iterator
    IntsToTypableString(seq).value should be("0y2345")
    IntsToTypableString(seq).value should be("6789ab")
    IntsToTypableString(seq).value should be("cdefgh")
    IntsToTypableString(seq).value should be("ijkzmn")
    IntsToTypableString(seq).value should be("opqrst")
    IntsToTypableString(seq).value should be("uvwx0y")
    IntsToTypableString(seq).value should be("234567")
  }

}
