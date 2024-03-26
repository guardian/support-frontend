package services

import com.gu.okhttp.RequestRunners
import com.gu.test.tags.annotations.IntegrationTest
import io.circe.JsonObject
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

/** this test is more for debugging as it is actually just a front for an S3 object. It is good to know that the API is
  * up and operational.
  */
@IntegrationTest
class ProductCatalogServiceSpec extends AsyncFlatSpec with Matchers {
  val prodService =
    new ProdProductCatalogService(RequestRunners.futureRunner)

  val codeService =
    new CodeProductCatalogService(RequestRunners.futureRunner)

  "ProdProductCatalogServiceSpec" should "get" in {
    prodService.get().map { result =>
      result.isEmpty shouldBe false
    }
  }

  "CodeProductCatalogServiceSpec" should "get" in {
    codeService.get().map { result =>
      result.isEmpty shouldBe false
    }
  }
}
