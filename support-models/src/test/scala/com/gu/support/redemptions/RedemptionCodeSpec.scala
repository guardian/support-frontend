package com.gu.support.redemptions

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class RedemptionCodeSpec extends AnyFlatSpec with Matchers {

  "RedemptionCode" should "disallow invalid chars" in {
    val badCodes = """ !"#$%&'()*+,./:;<=>?@[\]^_`abcdefghijklmnopqrstuvwxyz{|}~"""
    badCodes.foreach { char =>
      RedemptionCode(s"CODE$char").isLeft should be(true)
    }
  }

  it should "allow valid chars" in {
    val codes = """-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"""
    codes.foreach { char =>
      RedemptionCode(s"CODE$char").isRight should be(true)
    }
  }

}
