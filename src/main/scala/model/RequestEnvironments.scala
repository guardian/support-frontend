package model

import java.io.File

import com.typesafe.scalalogging.StrictLogging
import scala.io.Source.fromFile

// Models the environment to use for each request type.
sealed abstract class RequestEnvironments(val test: Environment, val live: Environment)

object RequestEnvironments extends StrictLogging {

  def fromAppStage: RequestEnvironments = {
    if (stage == "PROD") {
      logger.info("App started in PROD stage")
      LiveApp
    } else {
      logger.info("App started in non-PROD stage")
      TestApp
    }
  }

  private case object TestApp extends RequestEnvironments(test = Environment.Test, live = Environment.Test)

  private case object LiveApp extends RequestEnvironments(test = Environment.Test, live = Environment.Live)

  // The rest of the app should not have a notion of "stage".
  // Switching between test & live services should happen entirely
  // through the combination of RequestEnvironments and RequestType
  private def stage: String = stageFromFile getOrElse "DEV"

  private def stageFromFile: Option[String] = {
    val file = new File("/etc/gu/stage")
    if (file.exists) Some(fromFile(file).mkString.trim) else None
  }

}
