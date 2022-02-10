package admin
import admin.ServersideAbTest.Participation
import io.circe.Encoder

import scala.util.Random

object ServersideAbTest {
  // Serverside A/B tests currently only support a single concurrent test
  // running to 100% audience with a 50%/50% split

  def generateParticipations(testNames: List[String]): Map[String, Participation] =
    testNames.map(_ -> computeParticipation).toMap

  def computeParticipation: Participation = if (Random.nextBoolean()) Control else Variant

  sealed trait Participation
  case object Control extends Participation
  case object Variant extends Participation

  object Participation {
    implicit val encoder = Encoder.encodeString.contramap[Participation] {
      case Control => "Control"
      case Variant => "Variant"
    }
  }

  import io.circe.syntax._
  implicit val encoder = Encoder[Map[String, Participation]]

  val asJsonString: Map[String, Participation] => String = _.asJson.noSpaces
}
