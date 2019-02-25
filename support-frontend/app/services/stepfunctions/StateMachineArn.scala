package services.stepfunctions

object StateMachineArn {
  def fromString(arn: String): Option[StateMachineArn] = {
    PartialFunction.condOpt(arn.split(':').toList) {
      case "arn" :: "aws" :: "states" :: region :: accountId :: "stateMachine" :: stateMachineId :: Nil =>
        StateMachineArn(region, accountId, stateMachineId)
    }
  }
}

case class StateMachineArn(region: String, accountId: String, id: String) {
  val asString = s"arn:aws:states:$region:$accountId:stateMachine:$id"
}
