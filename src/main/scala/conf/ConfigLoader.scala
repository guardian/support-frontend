package conf

import cats.Show
import cats.data.Validated
import cats.syntax.either._
import cats.syntax.validated._
import cats.syntax.show._
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import simulacrum.typeclass

import scala.annotation.tailrec
import scala.collection.JavaConverters._
import scala.reflect._
import conf.ConfigLoader._
import model.{Environment, InitializationError, InitializationResult}
import play.api.Mode

// Load config from AWS parameter store.
class ConfigLoader(ssm: AWSSimpleSystemsManagement) {
  import ConfigLoader._

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

  private def executePathRequest[A : ClassTag, EnvType : Show](env: EnvType, request: GetParametersByPathRequest): Either[InitializationError, Map[String, String]] =
    Either.catchNonFatal(executePathRequestImpl(request, Map.empty)).leftMap { err =>
      InitializationError(s"error executing the parameter store request (${context[A](env)})", err)
    }

  def configForEnvironment[A : ParameterStoreLoadableByEnvironment : ClassTag](env: Environment): InitializationResult[A] = {
    val request = ParameterStoreLoadableByEnvironment[A].parametersByPathRequest(env)
    (for {
      result <- executePathRequest[A, Environment](env, request)
      config <- ParameterStoreLoadableByEnvironment[A].decode(env, result).toEither
    } yield config).toValidated
  }

  def configForPlayAppMode[A : ParameterStoreLoadableByPlayAppMode : ClassTag](mode: Mode): InitializationResult[A] = {
    val request = ParameterStoreLoadableByPlayAppMode[A].parametersByPathRequest(mode)
    (for {
      result <- executePathRequest[A, Mode](mode, request)
      config <- ParameterStoreLoadableByPlayAppMode[A].decode(mode, result).toEither
    } yield config).toValidated
  }
}

object ConfigLoader {
  implicit val environmentShow: Show[Environment] = Show.show[Environment](e => s"${e.entryName} request environment")
  implicit val playAppModeShow: Show[Mode] = Show.show[Mode](m => s"${m.asJava.toString} Play app mode")

  trait ParameterStoreLoadable[EnvType, A] {

    // The request to get all parameters required to build an instance of A for the given environment.
    // Parameters should be organised such that they can be obtained using a single path request.
    def parametersByPathRequest(environment: EnvType): GetParametersByPathRequest

    // The config loader takes care of executing the request and deserializing it to a Map[String, String]
    // The typeclass instance should then be able to transform this to an instance of A.
    def decode(environment: EnvType, data: Map[String, String]): Validated[InitializationError, A]
  }

  // A class should implement one of these in order to be loadable from the parameter store.
  @typeclass trait ParameterStoreLoadableByEnvironment[A] extends ParameterStoreLoadable[Environment, A]
  @typeclass trait ParameterStoreLoadableByPlayAppMode[A] extends ParameterStoreLoadable[Mode, A]

  private class PartiallyAppliedContext[A] {
    def apply[EnvType: Show](env: EnvType)(implicit ct: ClassTag[A]): String =
      s"type: ${classTag[A].runtimeClass}, environment: ${env.show}"
  }

  private def context[A]: PartiallyAppliedContext[A] = new PartiallyAppliedContext[A]

  // Utility class for implementing instances of the ParameterStoreLoadable typeclass.
  class ParameterStoreValidator[A : ClassTag, EnvType : Show](env: EnvType, data: Map[String, String]) {

    // If we need to make this method generic on the return type, we can pass an implicit ReaderT[Option, String, A],
    // to handle the parsing of a String to type A, but for now it's not required.
    def validate(key: String): InitializationResult[String] =
    // Need to specify the type of the fold explicitly
      data.get(key).fold[InitializationResult[String]](
        InitializationError(s"the key: $key is missing from the parameter store (${context[A](env)}").invalid
      )(_.valid)

    def validated[B](data: B): InitializationResult[B] = data.valid
  }
}
