package switchboard

sealed abstract class Group(val name: String)
object Group {
  case object Variant extends Group("variant")
  case object Control extends Group("control")
  case object Unknown extends Group("unknown")
}
