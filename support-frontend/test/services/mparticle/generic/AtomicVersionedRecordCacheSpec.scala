package services.mparticle.generic

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import services.mparticle.generic.AtomicUpdateAndGet.CacheValue

import scala.concurrent.{Future, Promise}

class AtomicVersionedRecordCacheSpec extends AsyncFlatSpec with Matchers {

  class TestAtomicUpdateAndGet[RECORD] extends AtomicUpdateAndGet[RECORD] {
    private var current: CacheValue[RECORD] = None

    override def updateAndGet(f: CacheValue[RECORD] => CacheValue[RECORD]): CacheValue[RECORD] = {
      current = f(current)
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
    val mockAtomicReference = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(mockTokenFetcher, mockAtomicReference)

    cache.get(None).map { actual =>
      actual.record shouldBe "record1"
      actual.version shouldBe 1
      mockTokenFetcher.fetchTokenCount shouldBe 1
    }
  }

  it should "return cached record on second get with no excluded version" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    for {
      _ <- cache.get(None)
      result <- cache.get(None)
    } yield {
      result.record shouldBe "record1"
      result.version shouldBe 1
      fetcher.fetchTokenCount shouldBe 1 // should not fetch again
    }
  }

  it should "refetch when current version is excluded" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    for {
      first <- cache.get(None)
      second <- cache.get(Some(1))
    } yield {
      first.version shouldBe 1
      second.record shouldBe "record2"
      second.version shouldBe 2
      fetcher.fetchTokenCount shouldBe 2
    }
  }

  it should "not refetch when excluded version doesn't match current" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    for {
      _ <- cache.get(None) // version 1
      result <- cache.get(Some(0))
    } yield {
      result.record shouldBe "record1"
      result.version shouldBe 1
      fetcher.fetchTokenCount shouldBe 1 // should not refetch
    }
  }

  it should "only fetch once for concurrent requests with empty cache" in {
    val fetcher = new TestSlowTokenFetcher()
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    val future1 = cache.get(None)
    val future2 = cache.get(None)
    val future3 = cache.get(None)

    fetcher.fetchCount shouldBe 1 // only one fetch initiated

    fetcher.promise.success("record1")

    for {
      result1 <- future1
      result2 <- future2
      result3 <- future3
    } yield {
      result1.record shouldBe "record1"
      result2.record shouldBe "record1"
      result3.record shouldBe "record1"
    }
  }

  it should "maintain version consistency across multiple refetches" in {
    val fetcher = new TestTokenFetcher(Iterator("record1", "record2", "record3"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    for {
      v1 <- cache.get(None)
      v2 <- cache.get(Some(1))
      v3 <- cache.get(Some(2))
    } yield {
      v1.version shouldBe 1
      v2.version shouldBe 2
      v3.version shouldBe 3
    }
  }

  behavior of "RecordCache filterCachedRecord"

  it should "return cached record when filterCachedRecord passes" in {
    val fetcher = new TestTokenFetcher(Iterator(10, 20, 30))
    val atomicUpdate = new TestAtomicUpdateAndGet[Int]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    var filterCallCount = 0
    val filteredCache = cache.filterCachedRecord { value =>
      filterCallCount += 1
      value > 5
    }

    filteredCache.get(None).map { result =>
      result.record shouldBe 10
      result.version shouldBe 1
      fetcher.fetchTokenCount shouldBe 1
      filterCallCount shouldBe 1
    }
  }

  it should "refetch when filterCachedRecord fails on cached record" in {
    val fetcher = new TestTokenFetcher(Iterator(3, 10, 20))
    val atomicUpdate = new TestAtomicUpdateAndGet[Int]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    var filterCallCount = 0
    val filteredCache = cache.filterCachedRecord { value =>
      filterCallCount += 1
      value > 5
    }

    filteredCache.get(None).map { result =>
      result.record shouldBe 10
      result.version shouldBe 2
      fetcher.fetchTokenCount shouldBe 2 // first record failed filter, so refetched
      filterCallCount shouldBe 1 // called once for 3 (failed), NOT for 10 as we intentionally don't retry a second time
    }
  }

  it should "call filterCachedRecord every time on cached values" in {
    val fetcher = new TestTokenFetcher(Iterator(10, 5, 20))
    val atomicUpdate = new TestAtomicUpdateAndGet[Int]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    var filterCallCount = 0
    val filteredCache = cache.filterCachedRecord { value =>
      filterCallCount += 1
      value > 8
    }

    for {
      first <- filteredCache.get(None)
      second <- filteredCache.get(None)
      third <- filteredCache.get(None)
    } yield {
      first.record shouldBe 10
      first.version shouldBe 1
      second.record shouldBe 10
      second.version shouldBe 1
      third.record shouldBe 10
      third.version shouldBe 1
      fetcher.fetchTokenCount shouldBe 1 // cached value still passes filter
      filterCallCount shouldBe 3 // filter called each time, even on cached value
    }
  }

  it should "apply filterCachedRecord on subsequent gets if the version is invalid" in {
    val fetcher = new TestTokenFetcher(Iterator(10, 5, 20))
    val atomicUpdate = new TestAtomicUpdateAndGet[Int]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    var filterCallCount = 0
    val filteredCache = cache.filterCachedRecord { value =>
      filterCallCount += 1
      value > 8
    }

    for {
      first <- filteredCache.get(None)
      second <- filteredCache.get(Some(1))
    } yield {
      first.record shouldBe 10
      first.version shouldBe 1
      second.record shouldBe 20
      second.version shouldBe 3
      fetcher.fetchTokenCount shouldBe 3 // fetched 10, then 5 (failed filter), then 20
      filterCallCount shouldBe 2 // filter called for 10, 5, and NOT on 20 as we don't retry a second time
    }
  }

  it should "refetch when filterCachedRecord becomes false for cached value (simulating expiry)" in {
    val fetcher = new TestTokenFetcher(Iterator(10, 20, 30))
    val atomicUpdate = new TestAtomicUpdateAndGet[Int]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)

    var threshold = 5
    var filterCallCount = 0
    val filteredCache = cache.filterCachedRecord { value =>
      filterCallCount += 1
      value > threshold
    }

    for {
      first <- filteredCache.get(None)
      _ = { threshold = 15 } // change the filter condition (simulating time passing)
      second <- filteredCache.get(None)
    } yield {
      first.record shouldBe 10
      first.version shouldBe 1
      second.record shouldBe 20 // refetched because cached value no longer passes filter
      second.version shouldBe 2
      fetcher.fetchTokenCount shouldBe 2
      filterCallCount shouldBe 2 // called for first get (10 passes), second get (10 fails), NOT for refetch as we return it regardless
    }
  }

  behavior of "RecordCache map"

  it should "transform the record while preserving version" in {
    val fetcher = new TestTokenFetcher(Iterator("hello", "world"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)
    val mappedCache = cache.map(_.toUpperCase)

    mappedCache.get(None).map { result =>
      result.record shouldBe "HELLO"
      result.version shouldBe 1
      fetcher.fetchTokenCount shouldBe 1
    }
  }

  it should "apply transformation on cached values" in {
    val fetcher = new TestTokenFetcher(Iterator("hello", "world"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)
    val mappedCache = cache.map(_.length)

    for {
      first <- mappedCache.get(None)
      second <- mappedCache.get(None)
    } yield {
      first.record shouldBe 5
      first.version shouldBe 1
      second.record shouldBe 5
      second.version shouldBe 1
      fetcher.fetchTokenCount shouldBe 1
    }
  }

  it should "chain multiple map operations" in {
    val fetcher = new TestTokenFetcher(Iterator("hello", "world"))
    val atomicUpdate = new TestAtomicUpdateAndGet[String]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)
    val mappedCache = cache
      .map(_.toUpperCase)
      .map(_.reverse)

    mappedCache.get(None).map { result =>
      result.record shouldBe "OLLEH"
      result.version shouldBe 1
    }
  }

  it should "work with map after filterCachedRecord" in {
    val fetcher = new TestTokenFetcher(Iterator(5, 10, 15))
    val atomicUpdate = new TestAtomicUpdateAndGet[Int]
    val cache = new AtomicVersionedRecordCache(fetcher, atomicUpdate)
    val transformedCache = cache
      .filterCachedRecord(_ > 8)
      .map(_ * 2)

    transformedCache.get(None).map { result =>
      result.record shouldBe 20
      result.version shouldBe 2
      fetcher.fetchTokenCount shouldBe 2 // filtered out 5, used 10
    }
  }
}
