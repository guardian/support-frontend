package com.gu.model.states

import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder

sealed abstract class QueryType(val value: String)

object QueryType {
  case object Full extends QueryType("full")
  case object Incremental extends QueryType("incremental")

  implicit val decoder: Decoder[QueryType] = Decoder.decodeString.emap(fromString)

  def fromString(str: String): Either[String, QueryType] =
    List(Full, Incremental).find(_.value == str).toRight("Unknown query type")
}

case class QueryZuoraState(
    queryType: QueryType,
)

object QueryZuoraState {
  implicit val decoder: Decoder[QueryZuoraState] = deriveDecoder
}
