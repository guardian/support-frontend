package services.mparticle.generic

import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import services.mparticle.generic.AtomicVersionedRecordCache.CacheValue
import services.mparticle.generic.RecordCache.Versioned

import scala.concurrent.{Future, Promise}
import scala.util.{Success, Failure}

class RecordCacheSpec extends AsyncFlatSpec with Matchers {

  class TestRecordCache[A](values: Iterator[A]) extends RecordCache[A] {
    var getCallCount = 0
    private var currentVersion = 0

    override def get(maybeInvalidVersion: Option[Int]): Future[Versioned[A]] = {
      println("get maybeInvalidVersion: " + maybeInvalidVersion)
      getCallCount += 1
      if (maybeInvalidVersion.contains(currentVersion)) {
        currentVersion += 1
      }
      if (currentVersion == 0) {
        currentVersion = 1
      }
      Future.successful(Versioned(values.next(), currentVersion))
    }
  }

  class TestVersionedRecordCache[A](results: Iterator[Option[A]]) extends VersionedRecordCache[A] {
    private var currentVersion = 0

    override def get(excludeVersion: Option[Int]): Versioned[Future[A]] = {
//      println("t excludeVersion: " + excludeVersion)
//      println("t currentVersion: " + currentVersion)
      if (excludeVersion.contains(currentVersion)) {
        currentVersion += 1
      }
      if (currentVersion == 0) {
        currentVersion = 1
      }
      val future = Future.fromTry(results.next() match {
        case Some(value) => Success(value)
        case None => Failure(new RuntimeException("failure"))
      })
      Versioned(future, currentVersion)
    }
  }

  behavior of "RecordCache retryFailedStoredValues"

  it should "return successful record without retry" in {
    val mockVersionedCache = new TestVersionedRecordCache(Iterator(Some("success1"), Some("success2")))
    val cache = RecordCache.withSingleRetry(mockVersionedCache)

    cache.get(None).map { result =>
      result.record shouldBe "success1"
      result.version shouldBe 1
    }
  }

  it should "retry once on failure and return successful result" in {
    val mockVersionedCache = new TestVersionedRecordCache(Iterator(None, Some("success")))
    val cache = RecordCache.withSingleRetry(mockVersionedCache)

    cache.get(None).map { result =>
      result.record shouldBe "success"
      result.version shouldBe 2
    }
  }

  it should "fail if both attempts fail" in {
    val mockVersionedCache = new TestVersionedRecordCache[String](Iterator(None, None))
    val cache = RecordCache.withSingleRetry(mockVersionedCache)

    recoverToSucceededIf[RuntimeException] {
      cache.get(None)
    }
  }

  it should "pass through excludeVersion to underlying cache" in {
    val mockVersionedCache = new TestVersionedRecordCache(Iterator(Some("v1"), Some("v2")))
    val cache = RecordCache.withSingleRetry(mockVersionedCache)

    cache.get(None).map { result =>
      result.version shouldBe 1
      result.record shouldBe "v1"
    }

    cache.get(Some(1)).map { result =>
      result.version shouldBe 2
      result.record shouldBe "v2"
    }
  }

  behavior of "RecordCache filterCachedRecord"

  it should "return cached record when filterCachedRecord passes" in {
    val mockCache = new TestRecordCache(Iterator(10, 20, 30))

    var filterCallCount = 0
    val filteredCache = mockCache.filterCachedRecord { value =>
      filterCallCount += 1
      value > 5
    }

    filteredCache.get(None).map { result =>
      result.record shouldBe 10
      result.version shouldBe 1
      mockCache.getCallCount shouldBe 1
      filterCallCount shouldBe 1
    }
  }

  it should "refetch when filterCachedRecord fails on cached record" in {
    val mockCache = new TestRecordCache(Iterator(3, 10, 20))

    var filterCallCount = 0
    val filteredCache = mockCache.filterCachedRecord { value =>
      filterCallCount += 1
      value > 5
    }

    filteredCache.get(None).map { result =>
      result.record shouldBe 10
      result.version shouldBe 2
      mockCache.getCallCount shouldBe 2 // first record failed filter, so refetched
      filterCallCount shouldBe 1 // called once for 3 (failed), NOT for 10 as we intentionally don't retry a second time
    }
  }

  it should "call filterCachedRecord every time on cached values" in {
    val mockCache = new TestRecordCache(Iterator(10, 10, 10))

    var filterCallCount = 0
    val filteredCache = mockCache.filterCachedRecord { value =>
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
      mockCache.getCallCount shouldBe 3 // filter called each time, even on cached value
      filterCallCount shouldBe 3
    }
  }

  it should "apply filterCachedRecord on subsequent gets if the version is invalid" in {
    val mockCache = new TestRecordCache(Iterator(10, 5, 20))

    var filterCallCount = 0
    val filteredCache = mockCache.filterCachedRecord { value =>
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
      mockCache.getCallCount shouldBe 3 // fetched 10, then 5 (failed filter), then 20
      filterCallCount shouldBe 2 // filter called for 10, 5, and NOT on 20 as we don't retry a second time
    }
  }

  it should "refetch when filterCachedRecord becomes false for cached value (simulating expiry)" in {
    val mockCache = new TestRecordCache(Iterator(10, 10, 20, 30))

    var threshold = 5
    var filterCallCount = 0
    val filteredCache = mockCache.filterCachedRecord { value =>
      println(s"filterCachedRecord: $value > $threshold ?")
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
      mockCache.getCallCount shouldBe 3
      filterCallCount shouldBe 2 // called for first get (10 passes), second get (10 fails), NOT for refetch as we return it regardless
    }
  }

  behavior of "RecordCache map"

  it should "transform the record while preserving version" in {
    val mockCache = new TestRecordCache(Iterator("hello", "world"))
    val mappedCache = mockCache.map(_.toUpperCase)

    mappedCache.get(None).map { result =>
      result.record shouldBe "HELLO"
      result.version shouldBe 1
      mockCache.getCallCount shouldBe 1
    }
  }

  it should "apply transformation on cached values" in {
    val mockCache = new TestRecordCache(Iterator("hello", "hello"))
    val mappedCache = mockCache.map(_.length)

    for {
      first <- mappedCache.get(None)
      second <- mappedCache.get(None)
    } yield {
      first.record shouldBe 5
      first.version shouldBe 1
      second.record shouldBe 5
      second.version shouldBe 1
      mockCache.getCallCount shouldBe 2
    }
  }

  it should "chain multiple map operations" in {
    val mockCache = new TestRecordCache(Iterator("hello", "world"))
    val mappedCache = mockCache
      .map(_.toUpperCase)
      .map(_.reverse)

    mappedCache.get(None).map { result =>
      result.record shouldBe "OLLEH"
      result.version shouldBe 1
    }
  }

  it should "work with map after filterCachedRecord" in {
    val mockCache = new TestRecordCache(Iterator(5, 10, 15))
    val transformedCache = mockCache
      .filterCachedRecord(_ > 8)
      .map(_ * 2)

    transformedCache.get(None).map { result =>
      result.record shouldBe 20
      result.version shouldBe 2
      mockCache.getCallCount shouldBe 2 // filtered out 5, used 10
    }
  }
}
