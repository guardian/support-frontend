package com.gu.support.acquisitions

import com.gu.support.acquisitions.utils.Retry

import org.scalatest.matchers.should.Matchers
import org.scalatest.flatspec.AnyFlatSpec

import cats.data.EitherT
import cats.instances.future._

import scala.concurrent.{Future, Await}
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class RetrySpec extends AnyFlatSpec with Matchers {

  it should "not retry if the either is a right" in {
    val alwaysSucceed = countTries(_ => {
      EitherT.fromEither[Future](Right[String, Unit](()))
    })

    Retry(max = 10)(alwaysSucceed())

    alwaysSucceed.tries should be(1)
  }

  it should "retry if the either is a left" in {
    val failOnce = countTries(tries => {
      EitherT.fromEither[Future](
        if (tries < 2) Left("error") else Right(())
      )
    })

    Await.result(Retry(max = 10)(failOnce()).value, atMost = 5.seconds)

    failOnce.tries should be(2)
  }

  it should "stop retrying after max retries" in {
    val alwaysFail = countTries(_ => {
      EitherT.fromEither[Future](Left[String, Unit]("error"))
    })
    val maxRetries = 10

    Await.result(Retry(maxRetries)(alwaysFail()).value, atMost = 5.seconds)

    alwaysFail.tries should be(maxRetries + 1)
  }

  def countTries[T](f: (Int) => T) = {
    class Wrapped(var tries: Int = 0) {
      def apply() = {
        tries += 1
        f(tries)
      }
    }

    new Wrapped()
  }
}
