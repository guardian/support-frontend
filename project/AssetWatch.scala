import java.net.InetSocketAddress

import sbt.File
import play.sbt.PlayRunHook
import scala.sys.process._

class AssetWatch(basePath: File) extends PlayRunHook {
  private var yarnWatch: Option[Process] = None

  override def afterStarted(addr: InetSocketAddress): Unit =
    yarnWatch = Some(Process("yarn devrun", basePath).run)

  override def afterStopped(): Unit =
    yarnWatch.foreach(_.destroy)
}
