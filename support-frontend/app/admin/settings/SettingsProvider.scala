package admin.settings

import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicReference
import admin.settings.SettingsProvider._
import akka.actor.ActorSystem
import cats.data.EitherT
import com.gu.aws.AwsS3Client
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import config.Configuration.MetricUrl
import config.{Configuration, FastlyConfig}
import io.circe.Decoder
import play.api.libs.ws.WSClient
import play.api.mvc.Result
import services.fastly.FastlyService

import scala.concurrent.duration._
import scala.concurrent.{ExecutionContext, Future}

abstract class SettingsProvider[T] {

  // Models the possibility of settings changing over the application life cycle.
  // For example, if settings are read from S3, the file can be polled for changes,
  // so that the setting updates can propagated without having to re-deploy the app.
  def settings(): T
}

class AllSettingsProvider private (
    switchesProvider: SettingsProvider[Switches],
    amountsProvider: SettingsProvider[ConfiguredAmounts],
    contributionTypesProvider: SettingsProvider[ContributionTypes],
    metricUrl: MetricUrl,
) {

  def getAllSettings(): AllSettings = {
    AllSettings(
      switchesProvider.settings(),
      amountsProvider.settings(),
      contributionTypesProvider.settings(),
      metricUrl,
    )
  }
}

object AllSettingsProvider {
  import admin.settings.Amounts.amountsDecoder
  import admin.settings.ContributionTypes.contributionTypesDecoder

  def fromConfig(
      config: Configuration,
  )(implicit client: AwsS3Client, system: ActorSystem, wsClient: WSClient): Either[Throwable, AllSettingsProvider] = {
    for {
      switchesProvider <- SettingsProvider.fromAppConfig[Switches](config.settingsSources.switches, config)
      amountsProvider <- SettingsProvider.fromAppConfig[ConfiguredAmounts](config.settingsSources.amounts, config)
      contributionTypesProvider <- SettingsProvider
        .fromAppConfig[ContributionTypes](config.settingsSources.contributionTypes, config)
    } yield new AllSettingsProvider(
      switchesProvider,
      amountsProvider,
      contributionTypesProvider,
      config.metricUrl,
    )
  }
}

class LocalFileSettingsProvider[T: Decoder] private (initialSettings: T) extends SettingsProvider[T] {
  override def settings(): T = initialSettings
}

object LocalFileSettingsProvider {

  def fromLocalFile[T: Decoder](localFile: SettingsSource.LocalFile): Either[Throwable, SettingsProvider[T]] =
    Settings.fromLocalFile(localFile).map(new LocalFileSettingsProvider[T](_))

}

class S3SettingsProvider[T: Decoder] private (
    initialSettings: T,
    source: SettingsSource.S3,
    fastlyService: Option[FastlyService],
)(implicit ec: ExecutionContext, s3Client: AwsS3Client, system: ActorSystem)
    extends SettingsProvider[T] {

  private val cachedSettings = new AtomicReference[T](initialSettings)

  def getAndSetSettings(): EitherT[Future, Throwable, SettingsUpdate[T]] =
    EitherT
      .fromEither(Settings.fromS3[T](source))
      .map(settings => SettingsUpdate(cachedSettings.getAndSet(settings), settings))

  def purgeIfChanged(diff: SettingsUpdate[T]): EitherT[Future, Throwable, SettingsUpdate[T]] =
    fastlyService
      // Only consider using the service if there has been a change
      .filter(_ => diff.isChange)
      .fold(EitherT.pure[Future, Throwable](diff)) { service =>
        SafeLogger.info(
          s"settings update detected, purging Fastly by surrogate key ${SettingsSurrogateKey.settingsSurrogateKey} " +
            "so that new settings propagate to the user",
        )
        service
          .purgeSurrogateKey(SettingsSurrogateKey.settingsSurrogateKey)
          // If there is a purge response, but it's not ok,
          // propagate the error so that it will be logged at the end of the flow.
          .ensureOr(response => new RuntimeException(s"failed to purge support frontend: $response"))(_.isOk)
          .map { response =>
            SafeLogger.info(s"settings purged successfully: $response")
            diff
          }
      }

  private def startPollingS3(): Unit =
    system.scheduler.schedule(1.minute, 1.minute) {
      getAndSetSettings()
        .flatMap(purgeIfChanged)
        .fold(
          err => SafeLogger.error(scrub"error occurred updating the settings from S3", err),
          update =>
            if (update.isChange) {
              SafeLogger.info(s"settings changed from ${update.old} to ${update.current}")
            },
        )
    }

  override def settings(): T = cachedSettings.get
}

object S3SettingsProvider {

  def fromS3[T: Decoder](s3: SettingsSource.S3, fastlyConfig: Option[FastlyConfig])(implicit
      client: AwsS3Client,
      system: ActorSystem,
      wsClient: WSClient,
  ): Either[Throwable, SettingsProvider[T]] = {
    // Ok using a single threaded execution context,
    // since the only one task is getting executed periodically (pollS3())
    implicit val ec: ExecutionContext = ExecutionContext.fromExecutor(Executors.newFixedThreadPool(1))

    val fastlyService = fastlyConfig.map(new FastlyService(_))
    if (fastlyConfig.isEmpty) {
      SafeLogger.warn("no Fastly config defined, Fastly will not be purged if there are settings updates from RRAC")
    }

    Settings.fromS3(s3).map { settings =>
      val service = new S3SettingsProvider[T](settings, s3, fastlyService)
      service.startPollingS3()
      service
    }
  }
}

object SettingsProvider {

  def fromAppConfig[T: Decoder](settingsSource: SettingsSource, config: Configuration)(implicit
      client: AwsS3Client,
      system: ActorSystem,
      wsClient: WSClient,
  ): Either[Throwable, SettingsProvider[T]] = {
    SafeLogger.info(s"loading settings from $settingsSource")
    settingsSource match {
      case s3: SettingsSource.S3 => S3SettingsProvider.fromS3[T](s3, config.fastlyConfig)
      case localFile: SettingsSource.LocalFile => LocalFileSettingsProvider.fromLocalFile[T](localFile)
    }
  }

  case class SettingsUpdate[T](old: T, current: T) {
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
