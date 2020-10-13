package com.gu.support.redemption.gifting.generator

import com.gu.support.workers.GiftCode
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class GiftCodeGeneratorSpec extends AnyFlatSpec with Matchers {

  it should "work in the basic case" in {
    val giftCode = GiftCodeGenerator.fromInts(Iterator.continually(0)).next.withDuration(GiftDuration.Gift3Month)
    giftCode.value should be("gd03-00000000")
  }

  it should "always produce different codes with the built in random" in {
    val generateGiftCode = GiftCodeGenerator.randomGiftCodes
    val giftCodes = generateGiftCode.map(_.withDuration(GiftDuration.Gift3Month))
    val numberToCheck = 10000
    val duplicateCodes = giftCodes.take(numberToCheck).toList.groupBy(identity).collect {
      case (code, list) if list.length > 1 => (code, list.length)
    }.toList
    duplicateCodes should be(List())
  }

}

class CodeBuilderSpec  extends AnyFlatSpec with Matchers {

  it should "get the durations right for the codes" in {
    CodeBuilder.build(CodeSuffixGenerator.CodeSuffix("00000000").get).withDuration(GiftDuration.Gift3Month).value should be("gd03-00000000")
    CodeBuilder.build(CodeSuffixGenerator.CodeSuffix("00000000").get).withDuration(GiftDuration.Gift6Month).value should be("gd06-00000000")
    CodeBuilder.build(CodeSuffixGenerator.CodeSuffix("00000000").get).withDuration(GiftDuration.Gift12Month).value should be("gd12-00000000")
  }

  it should "not allow invalid codes to be constructed" in {
    GiftCode("invalid") should be(None)
  }

}

class CodeSuffixGeneratorSpec extends AnyFlatSpec with Matchers {

  it should "deal with boundary condition 0-33 inclusive" in {
    CodeSuffixGenerator.codeFromGroup(List(0)) should be("0")
    CodeSuffixGenerator.codeFromGroup(List(-1)) should be("y")
    CodeSuffixGenerator.codeFromGroup(List(34)) should be("0")
    CodeSuffixGenerator.codeFromGroup(List(Int.MaxValue)) should be("p")
    CodeSuffixGenerator.codeFromGroup(List(Int.MinValue)) should be("q")
  }

  it should "cycle through all the possiblities" in {
    val seq = Stream.from(0).iterator
    CodeSuffixGenerator.generate(seq).take(7).toList.map(_.value) should be(
      List("0y234567", "89abcdef", "ghijkzmn", "opqrstuv", "wx0y2345", "6789abcd", "efghijkz")
    )
  }

  it should "not allow invalid code suffixes to be constructed" in {
    CodeSuffixGenerator.CodeSuffix("invalid") should be(None)
  }

}
