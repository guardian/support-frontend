package admin

import cats.syntax.either._
import com.amazonaws.services.s3.AmazonS3
import com.typesafe.config.Config
import monitoring.SafeLogger
import play.api.mvc.Result

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

class S3SettingsProvider private (initialSettings: Settings) extends SettingsProvider {

  // TODO: in a subsequent PR, poll S3 for changes.
  override def settings(): Settings = initialSettings
}

object S3SettingsProvider {

  def fromS3(s3: SettingsSource.S3)(implicit s3Client: AmazonS3): Either[Throwable, SettingsProvider] =
    Settings.fromS3(s3).map(new S3SettingsProvider(_))
}

object SettingsProvider {

  private def fromSettingsSource(source: SettingsSource)(implicit client: AmazonS3): Either[Throwable, SettingsProvider] = {
    SafeLogger.info(s"loading settings from $source")
    source match {
      case s3: SettingsSource.S3 => S3SettingsProvider.fromS3(s3)
      case localFile: SettingsSource.LocalFile => LocalFileSettingsProvider.fromLocalFile(localFile)
    }
  }

  private def fromConfiguration(config: Config)(implicit s3Client: AmazonS3): Either[Throwable, SettingsProvider] =
    SettingsSource.fromConfig(config).flatMap(fromSettingsSource)

  def fromConfigurationUnsafe(config: Config)(implicit s3: AmazonS3): SettingsProvider =
    fromConfiguration(config).valueOr { error =>
      throw new RuntimeException("unable to load settings provider from config", error)
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