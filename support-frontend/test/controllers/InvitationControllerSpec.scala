package controllers

import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import play.api.http.HttpEntity
import play.api.libs.json.{JsValue, Json}
import play.api.mvc.Result

class InvitationControllerSpec extends AnyWordSpec with Matchers {

  private def invitationBody(expiryDate: Long): String =
    Json
      .obj(
        "subscriptionName" -> "A-S00974337",
        "invitationCode" -> "twT95D1SFKBd",
        "primaryIdentityId" -> "112809589",
        "secondaryUserEmail" -> "invitee@example.com",
        "secondaryIdentityId" -> "21841960",
        "invitedDate" -> "2026-07-22",
        "expiryDate" -> expiryDate,
      )
      .toString

  private def jsonBody(result: Result): JsValue =
    result.body match {
      case HttpEntity.Strict(data, _) => Json.parse(data.utf8String)
      case other => fail(s"expected a strict HTTP entity, got $other")
    }

  "resultFromGetInvitation" should {
    "return the upstream status when it is not 200" in {
      val result = InvitationController.resultFromGetInvitation(404, """{"message":"not found"}""", nowMillis = 0)
      result.header.status mustBe 404
    }

    "return 200 when the invitation has not expired" in {
      val result = InvitationController.resultFromGetInvitation(200, invitationBody(2000), nowMillis = 1500)
      result.header.status mustBe 200
    }

    "return 410 with reason expired when the invitation has expired" in {
      val result = InvitationController.resultFromGetInvitation(200, invitationBody(1000), nowMillis = 2000)
      result.header.status mustBe 410
      jsonBody(result) mustBe Json.obj("reason" -> "expired")
    }

    "return 410 with reason expired when expiryDate equals now" in {
      val result = InvitationController.resultFromGetInvitation(200, invitationBody(1000), nowMillis = 1000)
      result.header.status mustBe 410
      jsonBody(result) mustBe Json.obj("reason" -> "expired")
    }

    "return 410 with reason alreadyAccepted when upstream reports the invitation is gone" in {
      val result = InvitationController.resultFromGetInvitation(
        410,
        """"Invitation has already been accepted"""",
        nowMillis = 0,
      )
      result.header.status mustBe 410
      jsonBody(result) mustBe Json.obj("reason" -> "alreadyAccepted")
    }

    "return 500 when a 200 response is missing expiryDate" in {
      val result = InvitationController.resultFromGetInvitation(200, """{"invitationCode":"abc"}""", nowMillis = 0)
      result.header.status mustBe 500
    }
  }
}
