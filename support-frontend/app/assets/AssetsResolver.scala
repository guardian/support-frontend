package assets

import play.api.Environment
import play.api.libs.json._
import play.twirl.api.Html
import views.{EmptyDiv, ReactDiv, SSRContent}

case class RefPath(value: String)
case class StyleContent(value: Html) extends AnyVal

class AssetsResolver(base: String, mapResource: String, env: Environment) {

  // better to use the typed one below
  def apply(path: String): String =
    apply(RefPath(path))

  def apply(path: RefPath): String =
    lookup.get(path).map(base + _).getOrElse(throw AssetNotFoundException(path))

  private lazy val lookup: Map[RefPath, String] = {
    for {
      rawResource <- loadResource(mapResource)
      mappings <- parseJson(rawResource)
    } yield mappings
  } getOrElse Map.empty

  private def loadResource(path: String) =
    env.resourceAsStream(path).map {
      scala.io.Source.fromInputStream(_).mkString
    }

  private def parseJson(json: String): Option[Map[RefPath, String]] =
    Json
      .parse(json)
      .validate[Map[String, String]]
      .asOpt
      .map(_.map { case (key, value) =>
        RefPath(key) -> value
      })

  def getFileContentsAsHtml(file: RefPath): Option[StyleContent] = {
    lookup.get(file).map(base + _).map(_.replaceFirst("^/assets/", "")) flatMap { resourcePath =>
      loadResource(s"public/compiled-assets/$resourcePath").map(string => StyleContent(Html(string)))
    }
  }

  protected def loadSsrHtmlCache: Map[String, Html] = {
    val files = env.getFile("conf/ssr-cache").listFiles.filter(_.getName.endsWith(".html"))
    val loadedHtml = for {
      file <- files
      html <- loadResource(s"ssr-cache/${file.getName}")
    } yield {
      file.getName -> Html(html)
    }

    loadedHtml.toMap
  }

  private val ssrHtmlCache = loadSsrHtmlCache

  def getSsrCacheContentsAsHtml(divId: String, file: String, classes: Option[String] = None): ReactDiv = {
    ssrHtmlCache.get(file).map(html => SSRContent(divId, html, classes)).getOrElse(EmptyDiv(divId))
  }

}

case class AssetNotFoundException(assetPath: RefPath)
    extends Exception(s"Cannot find asset $assetPath. You should run `yarn run build-dev`.")
