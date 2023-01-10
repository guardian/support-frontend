package controllers

import actions.CustomActionBuilders
import play.api.mvc._

import scala.concurrent.ExecutionContext

class SiteMap(
    actionRefiners: CustomActionBuilders,
    components: ControllerComponents,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components) {

  import actionRefiners._

  def sitemap: Action[AnyContent] = CachedAction() { implicit request =>
    val sitemapResponse =
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                            {supportLandingPages()}
                            {contributeLandingPages()}
                          </urlset>

    Ok(sitemapResponse)
  }

  private def supportLandingPages()(implicit req: RequestHeader) = {
    <url>
      <loc>{
      contributionsLandingPageUK()
    }</loc>
      <xhtml:link rel="alternate" hreflang="en-us" href={
      contributionsLandingPageUS()
    }/>
      <xhtml:link rel="alternate" hreflang="en" href={
      contributionsLandingPageUK()
    }/>
      <priority>1.0</priority>
    </url>
  }

  private def contributeLandingPages()(implicit req: RequestHeader) = {
    <url>
      <loc>{
      contributionsLandingPageUS()
    }</loc>
      <xhtml:link rel="alternate" hreflang="en-us" href={
      contributionsLandingPageUS()
    }/>
      <xhtml:link rel="alternate" hreflang="en" href={
      contributionsLandingPageUK()
    }/>
      <priority>1.0</priority>
    </url>
  }

  private def contributionsLandingPageUS()(implicit req: RequestHeader) = {
    routes.Application
      .contributionsLanding(
        country = "us",
        campaignCode = "",
      )
      .absoluteURL(secure = true)
  }

  private def contributionsLandingPageUK()(implicit req: RequestHeader) = {
    routes.Application
      .contributionsLanding(
        country = "uk",
        campaignCode = "",
      )
      .absoluteURL(secure = true)
  }


}
