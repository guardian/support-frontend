package services

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import org.scalatest.{BeforeAndAfterAll, Suite}
import play.api.libs.ws.WSClient
import play.api.libs.ws.ahc.AhcWSClient

import scala.concurrent.Await
import scala.concurrent.duration._

trait WSClientProvider extends BeforeAndAfterAll { self: Suite =>

  // These might have to be moved to a separate trait if they have other reverse dependencies.
  private implicit val system: ActorSystem = ActorSystem()
  private implicit val materializer: ActorMaterializer = ActorMaterializer()

  implicit val wsClient: WSClient = AhcWSClient()

  override protected def afterAll(): Unit = {
    wsClient.close()
    materializer.shutdown()
    Await.ready(system.terminate(), 1.second)
    super.afterAll()
  }
}
