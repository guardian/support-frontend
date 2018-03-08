package controllers

import actions.CustomActionBuilders
import play.api.mvc._

import scala.concurrent.ExecutionContext

class SiteMap(
    actionRefiners: CustomActionBuilders,
    components: ControllerComponents
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  import actionRefiners._

  def sitemap: Action[AnyContent] = CachedAction() { implicit request =>
    val sitemapResponse = <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                            { supportLandingPages }
                            { contributeLandingPages }
                          </urlset>

    Ok(sitemapResponse)
  }

  private def supportLandingPages()(implicit req: RequestHeader) = {
    <url>
      <loc>{
        routes.Application.bundleLanding().absoluteURL(secure = true)
      }</loc>
      <xhtml:link rel="alternate" hreflang="en-us" href={
        routes.Application.contributionsLandingUS().absoluteURL(secure = true)
      }/>
      <xhtml:link rel="alternate" hreflang="en" href={
        routes.Application.bundleLanding().absoluteURL(secure = true)
      }/>
      <priority>1.0</priority>
    </url>
  }

  private def contributeLandingPages()(implicit req: RequestHeader) = {
    <url>
      <loc>{
        routes.Application.contributionsLandingUS().absoluteURL(secure = true)
      }</loc>
      <xhtml:link rel="alternate" hreflang="en-us" href={
        routes.Application.contributionsLandingUS().absoluteURL(secure = true)
      }/>
      <xhtml:link rel="alternate" hreflang="en" href={
        routes.Application.bundleLanding().absoluteURL(secure = true)
      }/>
      <priority>1.0</priority>
    </url>
  }

}
