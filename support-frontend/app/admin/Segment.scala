package admin

import com.typesafe.config.Config
import io.circe.{Decoder, Encoder}

sealed abstract class Segment(val name: String)

object Segment {
  // Name of the header are defined and hard-coded in Fastly VCL to be assigned
  // to the correct proportion of traffic reflected by the name
  case object Perc0 extends Segment("Perc0")
  case object Perc50 extends Segment("Perc50")

  def fromConfig(config: Config, key: String): Segment = fromString(config.getString(key))

  def fromString(key: String): Segment = key match {
    case "Perc0" => Perc0
    case "Perc50" => Perc50
    case _ => Perc50
  }
  implicit val segmentEncoder: Encoder[Segment] = Encoder.encodeString.contramap[Segment](_.toString)
  implicit val segmentDecoder: Decoder[Segment] = Decoder.decodeString.map(Segment.fromString)
}
