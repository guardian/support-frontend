package controllers

import actions.CustomActionBuilders
import cats.implicits._
import scala.concurrent.duration._
import com.typesafe.scalalogging.StrictLogging
import controllers.ArticleShare.articleIds
import play.api.libs.json.Json
import play.api.mvc._
import services.Article._
import services.CapiService

import scala.concurrent.{ExecutionContext, Future}

object ArticleShare {
  val articleIds = List(
    "environment/ng-interactive/2020/oct/05/the-guardian-climate-pledge-2020-environment-emergency-carbon-emissions",
    "environment/2020/oct/05/the-guardians-climate-promise-we-will-keep-raising-the-alarm",
    "environment/2020/oct/05/our-world-is-facing-irreversible-destruction-and-still-theres-no-urgency-in-australian-climate-policy",
  )
}

class ArticleShare(
    actionRefiners: CustomActionBuilders,
    components: ControllerComponents,
    capiService: CapiService,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components)
    with StrictLogging {
  import actionRefiners._

  def getArticles: Action[AnyContent] = CachedAction(5.minutes).async {
    capiService
      .getArticles(articleIds)
      .fold(
        error => {
          logger.error("Failed to retrieve article data", error)
          InternalServerError("Failed to retrieve article data")
        },
        success => Ok(Json.toJson(success)),
      )
  }
}
