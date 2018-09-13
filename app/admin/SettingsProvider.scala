package admin

import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicReference

import admin.S3SettingsProvider.SettingsUpdate
import akka.actor.ActorSystem
import cats.syntax.either._
import com.amazonaws.services.s3.AmazonS3
import config.{Configuration, FastlyConfig}
import monitoring.SafeLogger
import monitoring.SafeLogger._

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._

abstract class SettingsProvider {

  def settings: Settings
}

class LocalFileSettingsProvider private (override val settings: Settings) extends SettingsProvider

object LocalFileSettingsProvider {

  def fromLocalFile(source: AdminSettingsSource.LocalFile): Either[Throwable, SettingsProvider] =
    Settings.fromLocalFile(source).map(new LocalFileSettingsProvider(_))
}

class S3SettingsProvider private (
    fastlyService: FastlyService,
    source: AdminSettingsSource.S3
)(implicit s3: AmazonS3, system: ActorSystem, ec: ExecutionContext) extends SettingsProvider {

  private val _settings: AtomicReference[Settings] = new AtomicReference[Settings]()

  def settings: Settings = _settings.get

  def setSettingsFromSource(): Either[Throwable, SettingsUpdate] =
    Settings.fromS3(source).map { settings =>
      SettingsUpdate(_settings.getAndSet(settings), settings)
    }

  def purgeIfChanged(diff: SettingsUpdate): Either[Throwable, SettingsUpdate] = {
    val purgeResult = if (diff.isChange) fastlyService.purgeAll() else Right(())
    purgeResult.map(_ => diff)
  }

  // TODO: check using a recursive function in this context is stack safe
  private def pollS3(): Unit =
    // TODO: should duration be configurable?
    system.scheduler.scheduleOnce(1.minute) {
      setSettingsFromSource()
        .flatMap(purgeIfChanged)
        .fold(
          // TODO: cloud watch metric / alert ?
          err => SafeLogger.error(scrub"error occurred getting settings from S3", err),
          diff => if (diff.isChange) SafeLogger.info(s"settings changed from ${diff.old} to ${diff.current}")
        )
      pollS3()
    }

  private def init(): Either[Throwable, Unit] =
    setSettingsFromSource().map(_ => pollS3())
}

object S3SettingsProvider {

  def fromS3(s3: AdminSettingsSource.S3, fastlyConfig: FastlyConfig)(implicit s3Client: AmazonS3, system: ActorSystem): Either[Throwable, SettingsProvider] = {
    // Er on the side of caution and use a dedicated execution context,
    // since we are using the synchronous S3 client.
    // Ok using a single threaded execution context,
    // since the only one task is getting executed periodically (pollS3())
    implicit val ec: ExecutionContext = ExecutionContext.fromExecutor(Executors.newFixedThreadPool(1))
    val fastlyService = new FastlyService(fastlyConfig)
    val settingsProvider = new S3SettingsProvider(fastlyService, s3)
    settingsProvider.init().map(_ => settingsProvider)
  }

  case class SettingsUpdate(old: Settings, current: Settings) {
    def isChange: Boolean = old != current
  }
}

object SettingsProvider {

  def fromConfiguration(config: Configuration)(implicit s3Client: AmazonS3, system: ActorSystem): Either[Throwable, SettingsProvider] = {
    config.settingsSource match {
      case s3: AdminSettingsSource.S3 => S3SettingsProvider.fromS3(s3, config.fastlyConfig)
      case localFile: AdminSettingsSource.LocalFile => LocalFileSettingsProvider.fromLocalFile(localFile)
    }
  }

  def fromConfigurationUnsafe(config: Configuration)(implicit s3: AmazonS3, system: ActorSystem): SettingsProvider =
    fromConfiguration(config).valueOr(throw _) // TODO: better error
}
