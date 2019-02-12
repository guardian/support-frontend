package controllers

import actions.CorsActionProvider
import backend.SubscribeWithGoogleBackend
import com.typesafe.scalalogging.StrictLogging
import model.DefaultThreadPool
import model.subscribewithgoogle.GoogleRecordPayment
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import scala.concurrent.Future

class SubscribeWithGoogleController(
                          cc: ControllerComponents,
                          susbcribeWithGoogleBackendProvider: RequestBasedProvider[SubscribeWithGoogleBackend]
                        )(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  override implicit val corsUrls: List[String] = allowedCorsUrls
  override implicit val controllerComponents: ControllerComponents = cc


  def recordPayment: Action[GoogleRecordPayment] = CorsAction.async(circe.json[GoogleRecordPayment]) { request =>


    Future.successful(Ok("{}"))
  }




}
