package conf

import cats.data.Validated
import cats.syntax.either._
import cats.syntax.validated._
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import com.amazonaws.services.simplesystemsmanagement.model.GetParametersByPathRequest
import simulacrum.typeclass

import scala.annotation.tailrec
import scala.collection.JavaConverters._
import scala.reflect._

import conf.ConfigLoader._
import model.{Environment, InitializationError, InitializationResult}

// Load config from AWS parameter store.
class ConfigLoader(ssm: AWSSimpleSystemsManagement) {

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

  private def executePathRequest[A : ClassTag](env: Environment, request: GetParametersByPathRequest): Either[InitializationError, Map[String, String]] =
    Either.catchNonFatal(executePathRequestImpl(request, Map.empty)).leftMap { err =>
      InitializationError(s"error executing the parameter store request (${context[A](env)})", err)
    }

  def loadConfig[A : ParameterStoreLoadable : ClassTag](env: Environment): InitializationResult[A] = {
    val request = ParameterStoreLoadable[A].parametersByPathRequest(env)
    (for {
      result <- executePathRequest[A](env, request)
      config <- ParameterStoreLoadable[A].decode(env, result).toEither
    } yield config).toValidated
  }
}

object ConfigLoader {

  // A class should implement this in order to be able be loaded from the parameter store.
  @typeclass trait ParameterStoreLoadable[A] {

    // The request to get all parameters required to build an instance of A for the given environment.
    // Parameters should be organised such that they can be obtained using a single path request.
    def parametersByPathRequest(environment: Environment): GetParametersByPathRequest

    // The config loader takes care of executing the request and deserializing it to a Map[String, String]
    // The typeclass instance should then be able to transform this to an instance of A.
    def decode(environment: Environment, data: Map[String, String]): Validated[InitializationError, A]
  }

  // Used to add context to an initialization error
  // TODO: consider making this a method on the InitializationError class
  private def context[A : ClassTag](environment: Environment): String =
    s"type: ${classTag[A].runtimeClass}, environment: ${environment.entryName}"

  // Utility class for implementing instances of the ParameterStoreLoadable typeclass.
  class ParameterStoreValidator[A : ClassTag](environment: Environment, data: Map[String, String]) {

    // If we need to make this method generic on the return type, we can pass an implicit ReaderT[Option, String, A],
    // to handle the parsing of a String to type A, but for now it's not required.
    def validate(key: String): InitializationResult[String] =
    // Need to specify the type of the fold explicitly
      data.get(key).fold[InitializationResult[String]](
        InitializationError(s"the key: $key is missing from the parameter store (${context[A](environment)}").invalid
      )(_.valid)

    def validated[B](data: B): InitializationResult[B] = data.valid
  }
}
