package wiring

import com.gu.aws.ProfileName
import com.gu.conf._
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import com.typesafe.scalalogging.StrictLogging
import play.api.ApplicationLoader.Context
import play.api._
import software.amazon.awssdk.auth.credentials._

import java.io.File
import scala.util.{Success, Try}

class AppLoader extends ApplicationLoader with StrictLogging {

  lazy val CredentialsProvider = AwsCredentialsProviderChain.builder.credentialsProviders(
    ProfileCredentialsProvider.builder.profileName(ProfileName).build,
    InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build,
    EnvironmentVariableCredentialsProvider.create()
  ).build

  private def getParameterStoreConfig(isDev: Boolean): Try[Configuration] = {
    for {
      identity <- if (isDev)
        Success(DevIdentity("support-frontend"))
      else
        AppIdentity.whoAmI(defaultAppName = "support-frontend", CredentialsProvider)
      loadedConfig <- Try(ConfigurationLoader.load(identity, CredentialsProvider) {
        case AwsIdentity(app, stack, stage, region) =>
          val privateConfig = SSMConfigurationLocation(s"/$stack/$app/$stage", region)
          val publicConfig = ResourceConfigurationLocation(s"$stage.public.conf")

          ComposedConfigurationLocation(List(privateConfig, publicConfig))

        case DevIdentity(_) =>
          //If a local private config file exists then override any DEV Parameter Store config
          val privateConfigLocal = FileConfigurationLocation(new File(s"/etc/gu/support-frontend.private.conf"))
          val privateConfigSSM = SSMConfigurationLocation(s"/support/frontend/DEV", "eu-west-1")
          val publicConfig = ResourceConfigurationLocation(s"DEV.public.conf")

          ComposedConfigurationLocation(List(privateConfigLocal, privateConfigSSM, publicConfig))
      })
    } yield Configuration(loadedConfig)
  }

  override def load(context: Context): Application = {

    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment)
    }

    val isDev = context.environment.mode == Mode.Dev

    val contextWithConfig = getParameterStoreConfig(isDev).map(config =>
      context.copy(initialConfiguration = config.withFallback(context.initialConfiguration))
    )

    try {
      (new BuiltInComponentsFromContext(contextWithConfig.get) with AppComponents).application
    } catch {
      case err: Throwable =>
        logger.error("Could not start application", err)
        throw err
    }
  }
}
