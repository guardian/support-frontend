package experiments

import java.time.LocalDate
import play.api.mvc.RequestHeader
import switchboard.{Switch, Switches}

sealed abstract class Group(val name: String)
case object Variant extends Group("variant")
case object Control extends Group("control")
case object Unknown extends Group("unknown")

abstract case class Experiment(
    name: String,
    description: String,
    segment: Segment
)(implicit switches: Switches) {
  val switch: Switch = Switch(
    name,
    description,
    switchboard.SwitchState.Off
  )

  private def isSwitchedOn: Boolean = switch.isOn && switches.serverSideExperiments.isOn

  private def checkHeader(headerName: String, predicate: String => Boolean)(implicit request: RequestHeader): Boolean =
    request.headers.get(headerName).exists(predicate)

  private def inVariant(implicit request: RequestHeader): Boolean = checkHeader(segment.headerName, _ == Variant.name)
  private def inControl(implicit request: RequestHeader): Boolean = checkHeader(segment.headerName, _ == Control.name)

  def canRun(implicit request: RequestHeader): Boolean = isSwitchedOn
  def isParticipating(implicit request: RequestHeader): Boolean = canRun && inVariant
  def isControl(implicit request: RequestHeader): Boolean = canRun && inControl
  def value(implicit request: RequestHeader): Group = {
    if (isParticipating)
      Variant
    else if (isControl)
      Control
    else
      Unknown
  }

}
