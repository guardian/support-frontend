package conf

import cats.data.Validated
import cats.kernel.Semigroup
import cats.instances.list._
import cats.syntax.either._
import cats.syntax.traverse._
import cats.syntax.validated._
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import simulacrum.typeclass

import scala.annotation.tailrec
import scala.collection.JavaConverters._
import scala.reflect._

import conf.ParameterStoreConfigLoader._
import model.Environment

class ParameterStoreConfigLoader(ssm: AWSSimpleSystemsManagement) {

  @tailrec private def executePathRequestImpl(request: GetParametersByPathRequest, data: Map[String, String]): Map[String, String] = {
    val result = ssm.getParametersByPath(request)
    val updatedData = data ++ result.getParameters.asScala.map { param =>
      // e.g. /hello/world/password => password
      param.getName.stripPrefix(request.getPath) -> param.getValue
    }
    // Cleaner to wrap in an option and fold, but then the function wouldn't be tail recursive.
    if (result.getNextToken == null) updatedData
    else executePathRequestImpl(request.withNextToken(result.getNextToken), updatedData)
  }

  private def executePathRequest(request: GetParametersByPathRequest): Either[ConfigLoadError, Map[String, String]] =
    Either.catchNonFatal(executePathRequestImpl(request, Map.empty)).leftMap { err =>
      ConfigLoadError(s"error executing the parameter store request: ${err.getMessage}")
    }

  def loadConfig[A : ParameterStoreLoadable](environment: Environment): Either[ConfigLoadError, A] = {
    val request = ParameterStoreLoadable[A].parametersByPathRequest(environment)
    for {
      result <- executePathRequest(request)
      config <- ParameterStoreLoadable[A].decode(environment, result).toEither
    } yield config
  }

  def loadConfigForEnvironments[A : ParameterStoreLoadable](environments: List[Environment]): Either[ConfigLoadError, EnvironmentConfigs[A]] = {
    environments
      // Either get all the errors as to why the config failed to load (over all environments provided),
      // or return a list giving the config loaded for each environment.
      .traverse[Validated[ConfigLoadError, ?], (Environment, A)] { env =>
        loadConfig(env).map(config => env -> config).toValidated
      }
      .map(configs => EnvironmentConfigs(configs.toMap))
      .toEither
  }
}

object ParameterStoreConfigLoader {

  case class ConfigLoadError(message: String) extends Exception {
    override def getMessage: String = s"ConfigLoadError: $message"
  }

  object ConfigLoadError {

    // Combine multiple errors into a single error.
    // Used when validating the Map[String, String] returned from the parameter store.
    implicit val configLoadErrorSemiGroup: Semigroup[ConfigLoadError] =
      Semigroup.instance((err1, err2) => ConfigLoadError(s"${err1.message} and ${err2.message}"))
  }

  // A class should implement this in order to be able be loaded from the parameter store.
  @typeclass trait ParameterStoreLoadable[A] {
    def parametersByPathRequest(environment: Environment): GetParametersByPathRequest
    def decode(environment: Environment, data: Map[String, String]): Validated[ConfigLoadError, A]
  }

  // Utility class for implementing instances of the ParameterStoreLoadable typeclass.
  class ParameterStoreValidator[A : ClassTag](environment: Environment, data: Map[String, String]) {

    type ValidationResult[B] = Validated[ConfigLoadError, B]

    private lazy val context = s"type: ${classTag[A].runtimeClass}, environment: ${environment.entryName}"

    // If we need to make this method generic on the return type,
    // we can pass an implicit ReaderT[Option, String, A],
    // to handle the parsing of a String to type A,
    // but for now it's not required.
    def validate(key: String): ValidationResult[String] =
    // Need to specify the type of the fold explicitly
      data.get(key).fold[ValidationResult[String]](
        ConfigLoadError(s"the key: $key is missing from the parameter store ($context)").invalid
      )(_.valid)

    def validated[B](data: B): ValidationResult[B] = data.valid
  }
}
