package utils

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class ObserverUtilsTest extends AnyFlatSpec with Matchers {
  "isObserverSubdomain" should "return true for the prod observer domain" in {
    ObserverUtils.isObserverSubdomain("observer.theguardian.com") should be(true)
  }

  it should "return false for the prod support domain" in {
    ObserverUtils.isObserverSubdomain("support.theguardian.com") should be(false)
  }

  it should "return true for the code observer domain" in {
    ObserverUtils.isObserverSubdomain("observer.code.dev-theguardian.com") should be(true)
  }

  it should "return false for the code support domain" in {
    ObserverUtils.isObserverSubdomain("support.code.dev-theguardian.com") should be(false)
  }

  it should "return false for a nonsense observer domain" in {
    ObserverUtils.isObserverSubdomain("observerblah.theguardian.com") should be(false)
  }
}
