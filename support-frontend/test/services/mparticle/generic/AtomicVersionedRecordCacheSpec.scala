package services.mparticle.generic

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import services.mparticle.generic.AtomicVersionedRecordCache.CacheValue

import scala.concurrent.{Future, Promise}

class AtomicVersionedRecordCacheSpec extends AsyncFlatSpec with Matchers {

  class TestMaybeUpdateAndGet[RECORD] extends MaybeUpdateAndGet[CacheValue[RECORD]] {
    private var current: CacheValue[RECORD] = None

    override def maybeUpdateAndGet(f: CacheValue[RECORD] => Option[CacheValue[RECORD]]): CacheValue[RECORD] = {
      current = f(current).getOrElse(current)
      current
    }
  }

  class TestTokenFetcher[A](values: Iterator[A]) extends TokenFetcher[A] {
    var fetchTokenCount = 0

    override def fetchToken(): Future[A] = {
      fetchTokenCount += 1
      Future.successful(values.next())
    }
  }

  class TestSlowTokenFetcher extends TokenFetcher[String] {
    val promise = Promise[String]()
    var fetchCount = 0
    override def fetchToken(): Future[String] = {
      fetchCount += 1
      promise.future
    }
  }

  behavior of "AtomicVersionedRecordCache"

  it should "fetch record on first get with no excluded version" in {
    val mockTokenFetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val mockAtomicReference = new TestMaybeUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(mockTokenFetcher, mockAtomicReference)

    val versioned = cache.get(None)
    versioned.version shouldBe 1
    versioned.record.map { actual =>
      actual shouldBe "record1"
      mockTokenFetcher.fetchTokenCount shouldBe 1
    }
  }

  it should "return cached record on second get with no excluded version" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val atomicUpdate = new TestMaybeUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    val first = cache.get(None)
    val second = cache.get(None)

    first.version shouldBe 1
    second.version shouldBe 1

    for {
      _ <- first.record
      result <- second.record
    } yield {
      result shouldBe "record1"
      fetcher.fetchTokenCount shouldBe 1 // should not fetch again
    }
  }

  it should "refetch when current version is excluded" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val atomicUpdate = new TestMaybeUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    val first = cache.get(None)
    first.version shouldBe 1

    for {
      _ <- first.record
      second = cache.get(Some(1))
      _ = { second.version shouldBe 2 }
      secondRecord <- second.record
    } yield {
      secondRecord shouldBe "record2"
      fetcher.fetchTokenCount shouldBe 2
    }
  }

  it should "not refetch when excluded version doesn't match current" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val atomicUpdate = new TestMaybeUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    val first = cache.get(None)
    first.version shouldBe 1

    for {
      _ <- first.record // version 1
      second = cache.get(Some(0))
      _ = { second.version shouldBe 1 }
      result <- second.record
    } yield {
      result shouldBe "record1"
      fetcher.fetchTokenCount shouldBe 1 // should not refetch
    }
  }

  it should "only fetch once for concurrent requests with empty cache" in {
    val fetcher = new TestSlowTokenFetcher()
    val atomicUpdate = new TestMaybeUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    val versioned1 = cache.get(None)
    val versioned2 = cache.get(None)
    val versioned3 = cache.get(None)

    fetcher.fetchCount shouldBe 1 // only one fetch initiated
    versioned1.version shouldBe 1
    versioned2.version shouldBe 1
    versioned3.version shouldBe 1

    fetcher.promise.success("record1")

    for {
      result1 <- versioned1.record
      result2 <- versioned2.record
      result3 <- versioned3.record
    } yield {
      result1 shouldBe "record1"
      result2 shouldBe "record1"
      result3 shouldBe "record1"
    }
  }

  it should "maintain version consistency across multiple refetches" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2", "record3"))
    val atomicUpdate = new TestMaybeUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    val v1 = cache.get(None)
    v1.version shouldBe 1

    for {
      _ <- v1.record
      v2 = cache.get(Some(1))
      _ = { v2.version shouldBe 2 }
      _ <- v2.record
      v3 = cache.get(Some(2))
      _ = { v3.version shouldBe 3 }
      _ <- v3.record
    } yield {
      succeed
    }
  }

}
