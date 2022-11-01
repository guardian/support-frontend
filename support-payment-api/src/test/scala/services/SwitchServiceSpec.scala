package services

import akka.actor.ActorSystem
import aws.AWSClientBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import java.time.LocalDateTime
import java.util.UUID
import model.{Currency, Environment, PaymentProvider, PaymentStatus}
import model.db.ContributionData
import services.ContributionsStoreQueueService.NewContributionData
import io.circe.parser._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.must.Matchers

class SwitchServiceSpec extends AnyFlatSpec with Matchers {

  "SwitchService" should "loads switches successfully" in {
    implicit val system: ActorSystem = ActorSystem()
    implicit val s3 = AWSClientBuilder.buildS3Client()

    val service = new SwitchService(Environment.Test)
    val switches = service.fromS3()
    switches.isRight mustBe true
  }
}
