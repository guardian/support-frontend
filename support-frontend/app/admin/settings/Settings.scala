package admin.settings

import java.io.FileNotFoundException
import java.nio.file.{Files, Paths}
import cats.implicits._
import com.amazonaws.services.s3.AmazonS3URI
import com.gu.aws.AwsS3Client
import com.gu.support.config.Stage
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec
import com.typesafe.config.Config
import com.typesafe.scalalogging.LazyLogging
import config.Configuration.MetricUrl
import io.circe.parser._
import io.circe.{Decoder, Encoder}

import scala.io.Source
import scala.util.Try

case class AllSettings(
  switches: Switches,
  amounts: ConfiguredAmounts,
  contributionTypes: ContributionTypes,
  metricUrl: MetricUrl
)

object AllSettings {
  import Amounts._  // intellij doesn't think this is needed, but it is
  import ContributionTypes._

  implicit val metricUrlEncoder: Encoder[MetricUrl] = Encoder.encodeString.contramap(_.value)
  implicit val metricUrlDecoder: Decoder[MetricUrl] = Decoder.decodeString.map(MetricUrl)
  implicit val allSettingsCodec: Codec[AllSettings] = deriveCodec[AllSettings]
}

object Settings {

  def fromS3[T: Decoder](source: SettingsSource.S3)(implicit s3: AwsS3Client): Either[Throwable, T] =
    for {
      buf <-
        s3.fetchAsString(new AmazonS3URI("s3://" + source.bucket + "/" + source.key)).toEither
      .leftMap(ex => new RuntimeException(s"couldn't getObject content for source: $source", ex))
      settings <- decode[T](buf)
    } yield settings

  def fromLocalFile[T: Decoder](source: SettingsSource.LocalFile): Either[Throwable, T] =
    for {
      buf <- Either.catchNonFatal {
        Source.fromFile(source.path)
      }
      settings <- decode[T](buf.mkString)
      _ <- Try(buf.close()).toEither
    } yield settings
}

case class SettingsSources(switches: SettingsSource, amounts: SettingsSource, contributionTypes: SettingsSource)

object SettingsSources {
  def fromConfig(config: Config, stage: Stage): Either[Throwable, SettingsSources] = {
    for {
      switchesSource <- SettingsSource.fromConfig(config, "switches_v2", stage)
      amountsSource <- SettingsSource.fromConfig(config, "configured-amounts", stage)
      contributionTypesSource <- SettingsSource.fromConfig(config, "contributionTypes", stage)
    } yield SettingsSources(switchesSource, amountsSource, contributionTypesSource)
  }
}

sealed trait SettingsSource

object SettingsSource extends LazyLogging {

  case class S3(bucket: String, key: String) extends SettingsSource {
    override def toString: String = s"s3://$bucket/$key"
  }

  case class LocalFile(path: String) extends SettingsSource {
    override def toString: String = s"local file at $path"
  }

  def fromConfig(config: Config, name: String, stage: Stage): Either[Throwable, SettingsSource] =
    fromLocalFile(config, name).orElse(fromS3(config, name, stage))
      .leftMap(err => new Error(s"settingsSource was not correctly set in config. $err"))

  private def fromLocalFile(config: Config, name: String): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    val localFile = expandHomeDirectory(config.getString(s"settingsSource.$name.local.path"))
    if (Files.exists(Paths.get(localFile))) {
      logger.info(s"Loading settings from $localFile")
      LocalFile(localFile)
    } else {
      logger.info(s"Local settings file doesn't exist: $localFile")
      throw new FileNotFoundException(localFile)
    }
  }

  private def expandHomeDirectory(path: String) = {
    val homeDir = System.getProperty("user.home")
    path.replaceFirst("~", homeDir)
  }

  private def fromS3(config: Config, name: String, stage: Stage): Either[Throwable, SettingsSource] = Either.catchNonFatal {
    S3(
      bucket = config.getString(s"settingsSource.s3.bucket"),
      key = s"$stage/$name.json"
    )
  }

}
