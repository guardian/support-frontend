package models.identity.requests

import com.gu.identity.model.PrivateFields
import play.api.libs.json.Json
import org.scalatest.wordspec.AnyWordSpec
import org.scalatest.matchers.should.Matchers

class CreateGuestAccountRequestBodyTest extends AnyWordSpec with Matchers {

  "CreateGuestAccountRequestBody" should {

    "be serialised as JSON" in {

      val body = CreateGuestAccountRequestBody(
        "test.user@theguardian.com",
        privateFields = PrivateFields(firstName = Some("moo")),
      )

      Json.toJson(body).toString shouldEqual
        """{"primaryEmailAddress":"test.user@theguardian.com","privateFields":{"firstName":"moo"}}"""
    }
  }
}
