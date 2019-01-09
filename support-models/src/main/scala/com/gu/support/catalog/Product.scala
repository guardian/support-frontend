package com.gu.support.catalog

import com.gu.support.catalog.Catalog.mapFields
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.workers.Contribution
import io.circe.{Decoder, DecodingFailure, Encoder, HCursor}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

sealed trait Product {
  def id: ProductId

  def name: String

  def productRatePlans: List[ProductRatePlan]
}

case class DigitalPack(id: ProductId, name: String, productRatePlans: List[ProductRatePlan]) extends Product

object DigitalPack {
  val productId = "2c92a0fb4edd70c8014edeaa4ddb21e7"
}

case class Contribution(id: ProductId, name: String, productRatePlans: List[ProductRatePlan]) extends Product

object Contribution {
  val productId = "2c92a0fe5aacfabe015ad24bf6e15ff6"
}

object Product {
  implicit val digitalPackDecoder: Decoder[DigitalPack] = deriveDecoder
  implicit val contributionDecoder: Decoder[Contribution] = deriveDecoder

  implicit val encoder: Encoder[Product] = deriveEncoder
  implicit val decoder: Decoder[Product] = Decoder.instance {
    cursor =>
      val product = for {
        id <- cursor.downField("id").as[String].toOption
        decoder <- decoderForProduct(id)
      } yield decoder.decodeJson(cursor.value)

      product.getOrElse(Left(decodingFailure(cursor)))
  }

  private def decodingFailure(cursor: HCursor) = {
    val id = cursor.downField("id").as[String].toOption.getOrElse("in this product")
    DecodingFailure(
      s"""
        The product id $id does not have a corresponding case class.
        Supported ids are defined in the companion objects of subclasses
        of the Product trait.
        Unsupported product ids should be filtered out by the Circe decoder of
        the Catalog class
        """, Nil
    )
  }


  private def decoderForProduct(id: String) = id match {
    case DigitalPack.productId => Some(digitalPackDecoder)
    case Contribution.productId => Some(contributionDecoder)
    case _ => None
  }
}
