package services.stepfunctions

import com.amazonaws.services.stepfunctions.model.StateMachineListItem
import org.scalatest.{MustMatchers, WordSpec}
import java.util.{Date, GregorianCalendar, UUID}

import cats.syntax.either._
import services.stepfunctions.StateMachineErrors.NoStateMachineFound

class StateMachineLookupTest extends WordSpec with MustMatchers {

  val date = new GregorianCalendar(2000, 1, 1, 0, 0, 0).getTime
  val newerDate = new GregorianCalendar(2000, 1, 2, 0, 0, 0).getTime

  val someMachineListItem = machine("1", "SomeMachinePROD", date)

  val contributionsMachineListItem = machine("1", "MonthlyContributionsPROD", date)
  val contributionsMachine = StateMachine.fromStateMachineListItem(contributionsMachineListItem)

  val newerContributionsMachineListItem = machine("1", "MonthlyContributionsPROD", newerDate)
  val newerContributionsMachine = StateMachine.fromStateMachineListItem(newerContributionsMachineListItem)

  val contributionsMachineCODEListItem = machine("1", "MonthlyContributionsCODE", date)

  "Find a state machine matching the prefix" in {
    StateMachineLookup.findMachine(
      items = List(someMachineListItem, contributionsMachineListItem),
      stateMachinePrefix = "MonthlyContributionsPROD-"
    ) mustEqual contributionsMachine.asRight
  }

  "Find the newest matching state machine" in {
    StateMachineLookup.findMachine(
      items = List(someMachineListItem, contributionsMachineListItem, newerContributionsMachineListItem),
      stateMachinePrefix = "MonthlyContributionsPROD-"
    ) mustEqual newerContributionsMachine.asRight
  }

  "Return NoStateMachineFound if there is no available state machine" in {
    StateMachineLookup.findMachine(
      items = List(someMachineListItem, contributionsMachineCODEListItem),
      stateMachinePrefix = "MonthlyContributionsPROD-"
    ) mustEqual NoStateMachineFound.asLeft
  }

  private def machine(arn: String, name: String, creationDate: Date): StateMachineListItem = {
    val item = new StateMachineListItem()
    item.setStateMachineArn(arn)
    item.setName(s"$name-${UUID.randomUUID()}")
    item.setCreationDate(creationDate)
    item
  }
}
