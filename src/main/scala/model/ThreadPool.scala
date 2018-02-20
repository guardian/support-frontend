package model

import akka.actor.ActorSystem
import cats.data.Validated
import enumeratum.EnumEntry.Lowercase
import enumeratum.{Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq
import scala.concurrent.ExecutionContext

sealed trait ThreadPool extends EnumEntry with Lowercase {

  def configPath: String = s"thread-pools.${this.entryName}"

  def load()(implicit system: ActorSystem): InitializationResult[ExecutionContext] =
    Validated.catchNonFatal(system.dispatchers.lookup(configPath)).leftMap { err =>
      InitializationError(s"unable to load thread pool from configuration at path: $configPath", err)
    }
}

object ThreadPool extends Enum[ThreadPool] {

  override val values: IndexedSeq[ThreadPool] = findValues

  case object Stripe extends ThreadPool

  case object Jdbc extends ThreadPool
}
