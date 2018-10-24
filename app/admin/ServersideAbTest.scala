package admin
import cookies.ServersideAbTestCookie
import play.api.mvc.RequestHeader

import scala.util.Random

object ServersideAbTest {
  // Serverside A/B tests currently only support a single concurrent test
  // running to 100% audience with a 50%/50% split
  def getParticipation(implicit request: RequestHeader): Participation = {
    ServersideAbTestCookie.get.fold(computeParticipation)(_.value match {
      case "Control" => Control
      case "Variant" => Variant
    })
  }

  private def computeParticipation: Participation = if (Random.nextBoolean) Control else Variant

  sealed trait Participation
  case object Control extends Participation
  case object Variant extends Participation
}
