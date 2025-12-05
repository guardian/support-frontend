package services.mparticle.generic

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class MaybeUpdateAndGetSpec extends AnyFlatSpec with Matchers {

  class TestAtomicUpdateAndGet extends AtomicUpdateAndGet[String] {
    private var current: String = "init"
    var updateAndGetCallCount = 0

    override def updateAndGet(f: String => String): String = {
      updateAndGetCallCount += 1
      current = f(current)
      current
    }

    override def get(): String = current
  }

  behavior of "MaybeUpdateAndGet"

  it should "update when function returns Some" in {
    val mockAtomic = new TestAtomicUpdateAndGet
    val maybeUpdate = MaybeUpdateAndGet(mockAtomic)

    val actual = maybeUpdate.maybeUpdateAndGet { current =>
      Some("update")
    }

    actual shouldBe "update"
    mockAtomic.updateAndGetCallCount shouldBe 1
  }

  it should "not update when function returns None" in {
    val mockAtomic = new TestAtomicUpdateAndGet
    val maybeUpdate = MaybeUpdateAndGet(mockAtomic)

    val actual = maybeUpdate.maybeUpdateAndGet { current =>
      None
    }

    actual shouldBe "init"
    mockAtomic.updateAndGetCallCount shouldBe 0
  }

  it should "return existing value when function returns None" in {
    val mockAtomic = new TestAtomicUpdateAndGet
    val maybeUpdate = MaybeUpdateAndGet(mockAtomic)

    maybeUpdate.maybeUpdateAndGet { _ =>
      Some("update")
    }

    mockAtomic.updateAndGetCallCount shouldBe 1

    val actual = maybeUpdate.maybeUpdateAndGet { current =>
      current shouldBe "update"
      None
    }

    actual shouldBe "update"
    mockAtomic.updateAndGetCallCount shouldBe 1 // still just 1
  }

  it should "be able to update twice" in {
    val mockAtomic = new TestAtomicUpdateAndGet
    val maybeUpdate = MaybeUpdateAndGet(mockAtomic)

    maybeUpdate.maybeUpdateAndGet { _ =>
      Some("update")
    }

    mockAtomic.updateAndGetCallCount shouldBe 1

    val actual = maybeUpdate.maybeUpdateAndGet { current =>
      current shouldBe "update"
      Some("update2")
    }

    actual shouldBe "update2"
    mockAtomic.updateAndGetCallCount shouldBe 2
  }

}
