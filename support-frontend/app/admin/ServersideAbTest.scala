package admin
import admin.ServersideAbTest.Participation
import io.circe.Encoder

import scala.util.Random

object ServersideAbTest {
  // Serverside A/B tests currently only support a single concurrent test
  // running to 100% audience with a 50%/50% split

  def computeParticipation: Participation = if (Random.nextBoolean) Control else Variant

  sealed trait Participation
  case object Control extends Participation
  case object Variant extends Participation

  object Participation {
    implicit val encoder = Encoder.encodeString.contramap[Participation] {
      case Control => "Control"
      case Variant => "Variant"
    }
  }
}

case class ContributionsServersideTests(stripeFraudDetection: Participation)

object ContributionsServersideTests {
  def assign: ContributionsServersideTests = ContributionsServersideTests(
    stripeFraudDetection = ServersideAbTest.computeParticipation
  )

  import io.circe.syntax._
  import io.circe.generic.auto._
  implicit val encoder = Encoder[ContributionsServersideTests]

  val asJsonString: ContributionsServersideTests => String = _.asJson.noSpaces
}
