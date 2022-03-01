import sbt.Keys.name
import sbtbuildinfo.BuildInfoPlugin.autoImport.{BuildInfoKey, buildInfoKeys}

import scala.sys.process._

object BuildInfoSettings {
  def env(key: String, default: String): String = Option(System.getenv(key)).getOrElse(default)

  def commitId(): String = try {
    "git rev-parse HEAD".!!.trim
  } catch {
    case _: Exception => "unknown"
  }

  val buildInfoKeys: Seq[BuildInfoKey] = Seq[BuildInfoKey](
    name,
    BuildInfoKey.constant("buildNumber", env("BUILD_NUMBER", "DEV")),
    BuildInfoKey.constant("buildTime", System.currentTimeMillis),
    BuildInfoKey.constant("gitCommitId", Option(System.getenv("BUILD_VCS_NUMBER")) getOrElse commitId()),
  )

}
