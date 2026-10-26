package admin.settings

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}

sealed trait Methodology

case class ABTest(
    name: String = "ABTest",
) extends Methodology

case class EpsilonGreedyBandit(
    name: String = "EpsilonGreedyBandit",
    epsilon: Double,
    sampleCount: Option[Int] = None,
) extends Methodology

case class Roulette(
    name: String = "Roulette",
    sampleCount: Option[Int] = None,
) extends Methodology

object Methodology {
  val defaultMethodologies: List[Methodology] = List(ABTest())

  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("name")
  implicit val methodologyDecoder: Decoder[Methodology] = deriveConfiguredDecoder[Methodology]
  implicit val methodologyEncoder: Encoder[Methodology] = deriveConfiguredEncoder[Methodology]
}
