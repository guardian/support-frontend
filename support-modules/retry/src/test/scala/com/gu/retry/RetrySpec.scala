package com.gu.retry

import cats.data.EitherT
import cats.instances.future._
import com.gu.retry.EitherTRetry.retry
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalTime
import java.time.temporal.ChronoUnit
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

class RetrySpec extends AnyFlatSpec with Matchers {

  it should "not retry if the either is a right" in {
    val alwaysSucceed = countTries(_ => {
      EitherT.fromEither[Future](Right[String, Unit](()))
    })

    val result = Await.result(
      retry(alwaysSucceed(), delay = 5.milliseconds, retries = 2).value,
      atMost = 15.seconds,
    )

    alwaysSucceed.tries should be(1)

    result match {
      case Right(()) => succeed
      case _ => fail
    }
  }

  it should "retry if the either is a left" in {
    val failOnce = countTries(tries => {
      EitherT.fromEither[Future](
        if (tries < 2) Left("error") else Right(()),
      )
    })

    val result = Await.result(
      retry(failOnce(), delay = 5.milliseconds, retries = 10).value,
      atMost = 5.seconds,
    )

    failOnce.tries should be(2)

    result match {
      case Right(()) => succeed
      case _ => fail
    }
  }

  it should "stop retrying after max retries" in {
    val alwaysFail = countTries(_ => {
      EitherT.fromEither[Future](Left[String, Unit]("error"))
    })
    val maxRetries = 10

    val result = Await.result(
      retry(alwaysFail(), delay = 5.milliseconds, retries = maxRetries).value,
      atMost = 15.seconds,
    )

    alwaysFail.tries should be(maxRetries + 1)

    result match {
      case Right(()) => fail
      case _ => succeed
    }
  }

  it should "delay retries correctly" in {
    val alwaysFail = countTries(_ => {
      EitherT.fromEither[Future](Left[String, Unit]("error"))
    })
    val maxRetries = 3
    val now = LocalTime.now()

    val result = Await.result(
      retry(alwaysFail(), delay = 1000.milliseconds, retries = maxRetries).value,
      atMost = 15.seconds,
    )
    val timeTakenInSeconds = now.until(LocalTime.now(), ChronoUnit.SECONDS)
    println(s"Number of seconds taken is $timeTakenInSeconds")

    alwaysFail.tries should be(maxRetries + 1)
    timeTakenInSeconds should be(maxRetries)

    result match {
      case Right(()) => fail
      case _ => succeed
    }
  }

  def countTries[A, B](f: Int => EitherT[Future, A, B]) = {
    class Wrapped(var tries: Int = 0) {
      def apply() = {
        tries += 1
        f(tries)
      }
    }

    new Wrapped()
  }
}
