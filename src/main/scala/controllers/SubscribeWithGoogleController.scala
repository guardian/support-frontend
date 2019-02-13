package controllers

import actions.CorsActionProvider
import backend.{BackendError, SubscribeWithGoogleBackend}
import cats.instances.future._
import cats.data.EitherT
import com.typesafe.scalalogging.StrictLogging
import model.{AcquisitionData, ClientBrowserInfo, DefaultThreadPool}
import model.subscribewithgoogle.GoogleRecordPayment
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

import scala.concurrent.Future

class SubscribeWithGoogleController(
                          cc: ControllerComponents,
                          subscribeWithGoogleBackendProvider: RequestBasedProvider[SubscribeWithGoogleBackend]
                        )(implicit pool: DefaultThreadPool, allowedCorsUrls: List[String])
    extends AbstractController(cc) with Circe with JsonUtils with StrictLogging with CorsActionProvider {

  override implicit val corsUrls: List[String] = allowedCorsUrls
  override implicit val controllerComponents: ControllerComponents = cc


  def recordPayment: Action[GoogleRecordPayment] = CorsAction.async(circe.json[GoogleRecordPayment]) { request =>
    import util.RequestTypeDecoder.instances._

    subscribeWithGoogleBackendProvider.getInstanceFor(request)
      .recordPayment(request.body,
        AcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None, None),
        ClientBrowserInfo("localhost", "whoknowsyet", None, "127.0.0.1", None)
      )

    Future.successful(Ok("{}"))
  }




}
