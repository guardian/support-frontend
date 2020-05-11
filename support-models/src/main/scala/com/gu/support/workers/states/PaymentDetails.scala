package com.gu.support.workers.states

import java.util.NoSuchElementException

import cats.syntax.functor._
import io.circe.generic.semiauto._
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json, JsonObject}

sealed abstract class PaymentDetails[+A] {
  def isEmpty: Boolean

  def get: A

  def exists(predicate: A => Boolean): Boolean = predicate(get)

  def map[B](f: A => B): PaymentDetails[B] = if (isEmpty) FreeProduct else PaidProduct(f(get))

  def foreach(f: A => Unit): Unit = if (!isEmpty)f(get)

  def isDefined: Boolean = !isEmpty

  def toOption: Option[A] = if (isEmpty) None else Some(get)

  def orElse[B >: A](alternative: => PaymentDetails[B]): PaymentDetails[B] = if (isEmpty) alternative else this
}

final case class PaidProduct[A](value: A) extends PaymentDetails[A] {

  override def get = value

  override def isEmpty = false
}

case object FreeProduct extends PaymentDetails[Nothing] {
  val value = "FreeProduct"

  override def get = throw new NoSuchElementException("FreeProduct.get")

  override def isEmpty = true
}

object PaymentDetails {
  implicit def paidProductEncoder[T: Encoder]: Encoder[PaidProduct[T]] = Encoder.instance(a => a.value.asJson)

  implicit def paidProductDecoder[T: Decoder]: Decoder[PaidProduct[T]] = deriveDecoder[PaidProduct[T]]
    .prepare(_.withFocus(
      json =>
        JsonObject.fromIterable(List("value" -> json)).asJson
    ))

  implicit def freeProductEncoder: Encoder[FreeProduct.type] = Encoder.instance(_ => Json.fromString(FreeProduct.value))

  implicit def freeProductDecoder: Decoder[FreeProduct.type] = Decoder.decodeString
    .emap(s => if (s == FreeProduct.value) Right(FreeProduct) else Left(s"This is not a ${FreeProduct.value}"))

  implicit def encoder[T: Encoder]: Encoder[PaymentDetails[T]] = Encoder.instance {
    case PaidProduct(a) => a.asJson
    case _ => FreeProduct.asJson
  }

  implicit def decoder[T: Decoder]: Decoder[PaymentDetails[T]] =
    List[Decoder[PaymentDetails[T]]](
      Decoder[FreeProduct.type].widen,
      Decoder[PaidProduct[T]].widen,
    ).reduceLeft(_ or _)
}
