package controllers

import actions.CustomActionBuilders
import play.api.mvc._
import scala.concurrent.{ExecutionContext, Future}

class ArticleShare(
  actionRefiners: CustomActionBuilders,
  components: ControllerComponents,
)(implicit val ec: ExecutionContext) extends AbstractController(components) {
  import actionRefiners._

  def getArticles(): Action[AnyContent] = CachedAction() {
    Ok("healthy")
  }
}
