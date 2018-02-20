package controllers

import cats.instances.future._
import com.typesafe.scalalogging.StrictLogging
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import scala.concurrent.ExecutionContext

import backend.StripeBackend
import model.stripe.StripeChargeData
import model.ResultBody

class StripeController(
    controllerComponents: ControllerComponents,
    stripeBackendProvider: RequestBasedProvider[StripeBackend]
  )(implicit ec: ExecutionContext) extends AbstractController(controllerComponents) with Circe with JsonUtils with StrictLogging {
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

  import util.RequestTypeDecoder.instances._

  // TODO: override Play's HTML error responses (e.g. non-JSON content type), provide JSON err description instead
  def createCharge: Action[StripeChargeData] = Action(circe.json[StripeChargeData]).async { request =>
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

    stripeBackendProvider.getInstanceFor(request)
      .createCharge(request.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        charge => Ok(ResultBody.Success(charge))
      )
  }
}
