package util

import cats.syntax.apply._

import model.{Environment, InitializationResult, RequestEnvironments}

// Build an instance of A for a given environment.
// The main benefit of this trait is to provide a standardised way of building a RequestBasedProvider for a given type.
trait EnvironmentBasedBuilder[A] {

  def build(env: Environment): InitializationResult[A]

  def buildRequestBasedProvider(envs: RequestEnvironments): InitializationResult[RequestBasedProvider[A]] =
    (build(envs.test), build(envs.live)).mapN(RequestBasedProvider.apply)
}
