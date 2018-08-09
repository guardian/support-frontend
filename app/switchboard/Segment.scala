package switchboard

import com.typesafe.config.Config

sealed abstract class Segment(val headerName: String)

object Segment {
  // Name of the header are defined and hard-coded in Fastly VCL to be assigned
  // to the correct proportion of traffic reflected by the name
  case object Perc0A extends Segment("X-GU-Experiment-0perc-A")
  case object Perc0B extends Segment("X-GU-Experiment-0perc-B")
  case object Perc0C extends Segment("X-GU-Experiment-0perc-C")
  case object Perc0D extends Segment("X-GU-Experiment-0perc-D")
  case object Perc0E extends Segment("X-GU-Experiment-0perc-E")
  case object Perc1A extends Segment("X-GU-Experiment-1perc-A")
  case object Perc1B extends Segment("X-GU-Experiment-1perc-B")
  case object Perc1C extends Segment("X-GU-Experiment-1perc-C")
  case object Perc1D extends Segment("X-GU-Experiment-1perc-D")
  case object Perc1E extends Segment("X-GU-Experiment-1perc-E")
  case object Perc2A extends Segment("X-GU-Experiment-2perc-A")
  case object Perc2B extends Segment("X-GU-Experiment-2perc-B")
  case object Perc2C extends Segment("X-GU-Experiment-2perc-C")
  case object Perc2D extends Segment("X-GU-Experiment-2perc-D")
  case object Perc2E extends Segment("X-GU-Experiment-2perc-E")
  case object Perc5A extends Segment("X-GU-Experiment-5perc-A")
  case object Perc10A extends Segment("X-GU-Experiment-10perc-A")
  case object Perc20A extends Segment("X-GU-Experiment-20perc-A")
  case object Perc50 extends Segment("X-GU-Experiment-50perc")

  def fromConfig(config: Config, key: String): Segment = config.getString(key) match {
    case "Perc0A" => Perc0A
    case "Perc0B" => Perc0B
    case "Perc0C" => Perc0C
    case "Perc0D" => Perc0D
    case "Perc0E" => Perc0E
    case "Perc1A" => Perc1A
    case "Perc1B" => Perc1B
    case "Perc1C" => Perc1C
    case "Perc1D" => Perc1D
    case "Perc1E" => Perc1E
    case "Perc2A" => Perc2A
    case "Perc2B" => Perc2B
    case "Perc2C" => Perc2C
    case "Perc2D" => Perc2D
    case "Perc2E" => Perc2E
    case "Perc5A" => Perc5A
    case "Perc10A" => Perc10A
    case "Perc20A" => Perc20A
    case "Perc50" => Perc50
    case _ => Perc0A
  }
}
