package services

import play.api.libs.json.{Json, Reads}
import play.api.libs.ws.WSClient
import scala.concurrent.{ExecutionContext, Future}
import play.api.libs.json._
import cats.data.EitherT
import cats.implicits._

case class CapiTypeData(altText: String, width: String)
case class CapiAsset(file: String, typeData: CapiTypeData)
case class CapiElement(assets: List[CapiAsset])
case class CapiContent(webTitle: String, webUrl: String, elements: List[CapiElement])
case class CapiResponse(content: CapiContent)

case class CapiResult(response: CapiResponse)
object CapiResult {
  implicit val readsCapiTypeData: Reads[CapiTypeData] = Json.reads[CapiTypeData]
  implicit val readsCapiAsset: Reads[CapiAsset] = Json.reads[CapiAsset]
  implicit val readsCapiElement: Reads[CapiElement] = Json.reads[CapiElement]
  implicit val readsCapiContent: Reads[CapiContent] = Json.reads[CapiContent]
  implicit val readsCapiResponse: Reads[CapiResponse] = Json.reads[CapiResponse]
  implicit val readsCapiResult: Reads[CapiResult] = Json.reads[CapiResult]
}

case class ArticleImage(imageUrl: String, altText: String)
object ArticleImage {
  def fromCapiElement(capiElement: CapiElement): Option[ArticleImage] = {
    capiElement.assets
      .filter(asset => asset.typeData.width.toInt >= 1000)
      .sortBy(asset => asset.typeData.width.toInt)
      .headOption
      .map { asset =>
        ArticleImage(imageUrl = asset.file, altText = asset.typeData.altText)
      }
  }
}

case class Article(articleUrl: String, headline: String, image: ArticleImage)
object Article {
  implicit val writesArticleImage: Writes[ArticleImage] = Json.writes[ArticleImage]
  implicit val writesArticle: Writes[Article] = Json.writes[Article]

  def fromCapiResult(capiResult: CapiResult): Option[Article] = {
    for {
      element <- capiResult.response.content.elements.headOption
      image <- ArticleImage.fromCapiElement(element)
    } yield {
      Article(
        articleUrl = capiResult.response.content.webUrl,
        headline = capiResult.response.content.webTitle,
        image = image,
      )
    }
  }
}

class CapiService(wsClient: WSClient, capiKey: String)(implicit ec: ExecutionContext) {

  def getArticle(articleId: String): EitherT[Future, String, Article] = {
    val url = s"https://content.guardianapis.com/$articleId?show-fields=headline&show-elements=image&api-key=$capiKey"

    wsClient
      .url(url)
      .execute()
      .attemptT
      .leftMap(_.toString)
      .subflatMap(resp => (resp.json).validate[CapiResult].asEither.leftMap(_.mkString(",")))
      .subflatMap { result =>
        Article.fromCapiResult(result) match {
          case Some(article) => Right(article)
          case None => Left("Failed to create article")
        }
      }
  }

  def getArticles(articleIds: List[String]): EitherT[Future, String, List[Article]] = {
    articleIds.map(getArticle).sequence
  }

}
