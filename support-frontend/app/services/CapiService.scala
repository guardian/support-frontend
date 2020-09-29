package services

import play.api.libs.json.{Json, Reads}
import play.api.libs.ws.WSClient
import scala.concurrent.{ExecutionContext, Future}
import play.api.libs.json._
import play.api.libs.json.Reads._
import cats.data.EitherT
import cats.implicits._
import play.api.libs.functional.syntax._

case class CapiImage(imageUrl: String, altText: String)

case class CapiArticle(articleUrl: String, headline: String, image: CapiImage)
object CapiArticle {
  implicit val capiImageWrites: Writes[CapiImage] = Json.writes[CapiImage]
  implicit val capiImageReads: Reads[CapiImage] = (
    (JsPath \ "file").read[String] and
      (JsPath \ "typeData" \ "altText").read[String]
    )(CapiImage.apply _)

  implicit val capiResponseWrites: Writes[CapiArticle] = Json.writes[CapiArticle]
  implicit val capiResponseReads: Reads[CapiArticle] = (
    (JsPath \ "response" \ "content" \ "webUrl").read[String] and
      (JsPath \ "response" \ "content" \ "webTitle").read[String] and
      (JsPath \ "response" \ "content" \ "elements" \ 0 \ "assets" \ 0).read[CapiImage]
    )(CapiArticle.apply _)
}

class CapiService(wsClient: WSClient, capiKey: String)(implicit ec: ExecutionContext) {

  def getArticle(articleId: String): EitherT[Future, String, CapiArticle] = {
    val url = s"https://content.guardianapis.com/$articleId?show-fields=headline&show-elements=all&api-key=$capiKey"
    wsClient.url(url)
      .execute()
      .attemptT
      .leftMap(_.toString)
      .subflatMap(resp => (resp.json).validate[CapiArticle].asEither.leftMap(_.mkString(",")))
  }

  def getArticles(articleIds: List[String]): EitherT[Future, String, List[CapiArticle]] = {
    articleIds.map(getArticle).sequence
  }

}
