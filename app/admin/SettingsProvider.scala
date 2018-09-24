package admin

import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicReference

import akka.actor.ActorSystem
import cats.data.EitherT
import cats.instances.future._
import com.amazonaws.services.s3.AmazonS3
import config.{Configuration, FastlyConfig}
import monitoring.SafeLogger
import play.api.libs.ws.WSClient
import play.api.mvc.Result

import services.fastly.FastlyService
import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

abstract class SettingsProvider {

  // Models the possibility of settings changing over the application life cycle.
  // For example, if settings are read from S3, the file can be polled for changes,
  // so that the setting updates can propagated without having to re-deploy the app.
  def settings(): Settings
}

class LocalFileSettingsProvider private (initialSettings: Settings) extends SettingsProvider {
  override def settings(): Settings = initialSettings
}

object LocalFileSettingsProvider {

  def fromLocalFile(localFile: SettingsSource.LocalFile): Either[Throwable, SettingsProvider] =
    Settings.fromLocalFile(localFile).map(new LocalFileSettingsProvider(_))
}

class S3SettingsProvider private (
    initialSettings: Settings,
    source: SettingsSource.S3,
    fastlyService: FastlyService
)(implicit ec: ExecutionContext, s3Client: AmazonS3, system: ActorSystem) extends SettingsProvider {
  import SettingsProvider._
  import SafeLogger._

  private val cachedSettings = new AtomicReference[Settings](initialSettings)

  def getAndSetSettings(): EitherT[Future, Throwable, SettingsUpdate] =
    EitherT.fromEither(Settings.fromS3(source))
      .map(settings => SettingsUpdate(cachedSettings.getAndSet(settings), settings))

  def purgeIfChanged(diff: SettingsUpdate): EitherT[Future, Throwable, SettingsUpdate] = {
    val purgeResult =
      if (diff.isChange) fastlyService.purgeSurrogateKey(SettingsSurrogateKey.settingsSurrogateKey)
      else EitherT.pure[Future, Throwable](())
    purgeResult.map(_ => diff)
  }

  // TODO: check using a recursive function in this context is stack safe
  private def pollS3(): Unit =
    // TODO: should duration be configurable?
    system.scheduler.scheduleOnce(1.minute) {
      getAndSetSettings()
        .flatMap(purgeIfChanged)
        .fold(
          err => SafeLogger.error(scrub"error occurred getting settings from S3", err),
          update => if (update.isChange) SafeLogger.info(s"settings changed from ${update.old} to ${update.current}")
        )
        .map(_ => pollS3())
    }

  override def settings(): Settings = cachedSettings.get
}

object S3SettingsProvider {

  def fromS3(s3: SettingsSource.S3, fastlyConfig: FastlyConfig)(
    implicit
    client: AmazonS3,
    system: ActorSystem,
    wsClient: WSClient
  ): Either[Throwable, SettingsProvider] = {
    // Ok using a single threaded execution context,
    // since the only one task is getting executed periodically (pollS3())
    implicit val ec: ExecutionContext = ExecutionContext.fromExecutor(Executors.newFixedThreadPool(1))
    val fastlyService = new FastlyService(fastlyConfig)
    Settings.fromS3(s3).map { settings =>
      val service = new S3SettingsProvider(settings, s3, fastlyService)
      service.pollS3()
      service
    }
  }
}

object SettingsProvider {

  def fromAppConfig(config: Configuration)(implicit client: AmazonS3, system: ActorSystem, wsClient: WSClient): Either[Throwable, SettingsProvider] = {
    SafeLogger.info(s"loading settings from ${config.settingsSource}")
    config.settingsSource match {
      case s3: SettingsSource.S3 => S3SettingsProvider.fromS3(s3, config.fastlyConfig)
      case localFile: SettingsSource.LocalFile => LocalFileSettingsProvider.fromLocalFile(localFile)
    }
  }

  case class SettingsUpdate(old: Settings, current: Settings) {
    def isChange: Boolean = old != current
  }
}

// If an action requires settings to handle a request,
// then 'Surrogate-Key' header should be set with value 'settings' on any result that is returned by said action.
// This means that if the settings change over the application life-cycle,
// the routes that need to be purged (so that changes in settings propagate to the user) can be efficiently targeted.
// See https://docs.fastly.com/api/purge#purge_d8b8e8be84c350dd92492453a3df3230 for more details.
object SettingsSurrogateKey {
  val settingsSurrogateKey = "settings"
  // Codacy prefers this over a fully qualified method name
  def addTo(result: Result): Result = result.withHeaders("Surrogate-Key" -> settingsSurrogateKey)
}

// Convenient way of settings settings Surrogate-Key.
// Mix this trait into controllers for the syntax: result.withSettingSurrogateKey
trait SettingsSurrogateKeySyntax {

  implicit class ResultSyntax(result: Result) {
    def withSettingsSurrogateKey: Result = SettingsSurrogateKey.addTo(result)
  }
}
