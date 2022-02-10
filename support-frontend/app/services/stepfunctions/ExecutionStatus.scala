package services.stepfunctions

sealed trait ExecutionStatus {
  def unsuccessful: Boolean
}

object ExecutionStatus {
  object Aborted extends ExecutionStatus { override def unsuccessful: Boolean = true }
  object Failed extends ExecutionStatus { override def unsuccessful: Boolean = true }
  object TimedOut extends ExecutionStatus { override def unsuccessful: Boolean = true }
  object Started extends ExecutionStatus { override def unsuccessful: Boolean = false }
  object Succeeded extends ExecutionStatus { override def unsuccessful: Boolean = false }

  val all = Map(
    "ExecutionAborted" -> Aborted,
    "ExecutionFailed" -> Failed,
    "ExecutionStarted" -> Started,
    "ExecutionSucceeded" -> Succeeded,
    "ExecutionTimedOut" -> TimedOut,
  )
}
