package services.stepfunctions

import org.scalatest.{BeforeAndAfterAll, MustMatchers, WordSpec}

import scala.concurrent.Future
import akka.actor.ActorSystem
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.time.SpanSugar._

class ResourceManagerTest extends WordSpec with MustMatchers with BeforeAndAfterAll with ScalaFutures {
  implicit val system = ActorSystem("ResourceManagerTest")
  implicit val ec = system.dispatcher
  implicit override val patienceConfig = PatienceConfig(timeout = scaled(1.seconds))

  "Refresh the resource the first time it is requested (refresh=false)" in {
    val manager = new ResourceManager[String](getResource)
    whenReady(manager.get(false)) { resource =>
      resource mustEqual "string-resource-1"
    }
  }

  "Refresh the resource the first time it is requested (refresh=true)" in {
    val manager = new ResourceManager[String](getResource)
    whenReady(manager.get(true)) { resource =>
      resource mustEqual "string-resource-1"
    }
  }

  "Do not refresh the resource the second time if refresh=false" in {
    val manager = new ResourceManager[String](getResource)
    whenReady(manager.get(false).flatMap { _ => manager.get(false) }) { resource =>
      resource mustEqual "string-resource-1"
    }
  }

  "Refresh the resource the second time if refresh=true" in {
    val manager = new ResourceManager[String](getResource)
    whenReady(manager.get(false).flatMap { _ => manager.get(true) }) { resource =>
      resource mustEqual "string-resource-2"
    }
  }

  "Only refresh the resource once if multiple refreshes are requested before first completes" in {
    val manager = new ResourceManager[String](getResourceDelayed)
    manager.get(true)
    manager.get(true)
    manager.get(true)
    whenReady(manager.get(true)) { resource =>
      resource mustEqual "string-resource-1"
    }
  }

  private def getResource: () => Future[String] = {
    var counter = 0
    () => {
      Future.successful {
        counter = counter + 1
        s"string-resource-$counter"
      }
    }
  }

  private def getResourceDelayed: () => Future[String] = {
    var counter = 0
    () => {
      Future {
        counter = counter + 1
        Thread.sleep(100)
        s"string-resource-$counter"
      }
    }
  }

  override def afterAll {
    system.terminate()
  }
}
