package controllers

import com.stripe
import io.circe.generic.auto._
import io.circe.syntax._
import play.api.Configuration
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, ControllerComponents}
import scala.collection.JavaConverters._

import scala.collection.immutable.HashMap

class StripeController(controllerComponents: ControllerComponents, config: Configuration)
    extends AbstractController(controllerComponents)
    with Circe {
  // Other considerations:
  // - CORS
  // - Test users
  // - Remember that API will change: no redirectUrl!

  /*

   SUPPORT
  {
    name: user.fullName,
    currency,
    amount,
    email: user.email,
    token: paymentToken,
    marketing: user.gnmMarketing,
    postcode: user.postcode,
    ophanPageviewId: ophanIds.pageviewId,
    ophanBrowserId: ophanIds.browserId,
    ophanVisitId: ophanIds.visitId,
    idUser: user.id,
    cmp: null,
    platform: null,
    intcmp: referrerAcquisitionData.campaignCode,
    refererPageviewId: referrerAcquisitionData.referrerPageviewId,
    refererUrl: referrerAcquisitionData.referrerUrl,
    componentId: referrerAcquisitionData.componentId,
    componentType: referrerAcquisitionData.componentType,
    source: referrerAcquisitionData.source,
    nativeAbTests: participationsToAcquisitionABTest(abParticipations),
    refererAbTest: referrerAcquisitionData.abTest,
    isSupport: true,
  }

  {
    "name": "TvuNHjDz9vh4F4EZOLc TvuNHjDz9vh4F4EZOLc",
    "currency": "GBP",
    "amount": 1,
    "email": "joseph.smith+tvunhjdz9vh4f4ezolc@theguardian.com",
    "token": "tok_1Bql4CCbpG0cQtlbE3ZZcksL",
    "marketing": false, // always false now, right? maybe we should remove
    "postcode": // remove?
    "ophanPageviewId": "jd4puekoxtz8jasje85o",
    "ophanBrowserId": "ZELM-ObGkQSAiUvKRjp-TYog",
    "ophanVisitId": "AWFSIcn7",
    "idUser": "18523297",
    "cmp": null, // ALWAYS NULL from support
    "platform": null, // ALWAYS NULL from support
    "nativeAbTests": [
    {
      "name": "usSecureLogoTest",
      "variant": "notintest"
    }
    ],
    "isSupport": true

    // REFERRER
    intcmp: referrerAcquisitionData.campaignCode,
    refererPageviewId: referrerAcquisitionData.referrerPageviewId,
    refererUrl: referrerAcquisitionData.referrerUrl,
    componentId: referrerAcquisitionData.componentId,
    componentType: referrerAcquisitionData.componentType,
    source: referrerAcquisitionData.source,
    refererAbTest: referrerAcquisitionData.abTest,
  }

   CONTRIBUTE

  {
    "name": "TvuNHjDz9vh4F4EZOLc TvuNHjDz9vh4F4EZOLc",
    "currency": "gbp",
    "amount": 1,
    "email": "joseph.smith+tvunhjdz9vh4f4ezolc@theguardian.com",
    "token": "tok_1BqkkWCbpG0cQtlba8n5mIsp",
    "postcode": "",
    "ophanPageviewId": "jd4pei0mqbt1k1tu99zv",
    "ophanBrowserId": "ZELM-ObGkQSAiUvKRjp-TYog",
    "cmp": null,
    "intcmp": null,
    "refererPageviewId": null,
    "refererUrl": "https:\/\/profile.theguardian.com\/signin?skipConfirmation=true",
    "ophanVisitId": "AWFSIcn7",
    "componentId": null,
    "componentType": null,
    "source": null,
    "refererAbTest": null,
    "nativeAbTests": [
      {
        "name": "stripe-checkout",
        "variant": "stripe"
      }
    ]
  }

*/
  case class StripeChargeRequest(token: String, amount: Int)

  // TODO: override Play's HTML error responses (e.g. non-JSON content type), provide JSON err description instead
  def createCharge() = Action(circe.json[StripeChargeRequest]) { request =>
    // Deserialize POSTed JSON
    // stripe.Charge.create
    // if success:
    //   log
    //   save to DB
    //   send to Ophan
    //   return JSON
    // if fail:
    //   log
    //   return JSON

    val chargeRequest = request.body

    // TODO: fetch configs in centralised place, on app startup
    val maybeStripeKey = config.getOptional[String]("stripe.keys.default.TEST.secret")
    stripe.Stripe.apiKey = maybeStripeKey.getOrElse("")

    val chargeParams = Map[String, AnyRef](
      // We've lost type-safety here, unfortunately
      "amount" -> new Integer(chargeRequest.amount),
      "currency" -> "gbp",
      "description" -> "Test payment via Payment API",
      "source" -> chargeRequest.token
    )

    try {
      Ok(stripe.model.Charge.create(chargeParams.asJava).toJson)
    } catch {
      // TODO: more fine-grained
      case e: stripe.exception.StripeException => BadRequest(e.toString)
    }
  }
}
