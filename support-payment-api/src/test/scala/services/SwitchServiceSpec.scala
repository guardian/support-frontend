package services

import akka.actor.ActorSystem
import aws.AWSClientBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import model.Environment

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers

class SwitchServiceSpec extends AnyFlatSpec with Matchers {
// Integration test to load switches from S3 ,This will not run on the build server, but can be run locally.
  "SwitchService" should "loads switches successfully" ignore {
    implicit val system: ActorSystem = ActorSystem()
    implicit val s3 = AWSClientBuilder.buildS3Client()

    val service = new SwitchService(Environment.Test)
    val switches = service.fromS3()
    switches.isRight mustBe true
  }
}
