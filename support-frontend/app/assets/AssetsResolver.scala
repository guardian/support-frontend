package assets

import play.api.Environment
import play.api.libs.json._
import play.twirl.api.Html
import views.StyleContent

case class RefPath(value: String)

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
    Json.parse(json).validate[Map[String, String]].asOpt.map(_.map {
      case (key, value) => RefPath(key) -> value
    })

  def getFileContentsAsHtml(file: RefPath): Option[StyleContent] = {
    val resourcePath = apply(file).replaceFirst("^/assets/", "")
    loadResource(s"public/compiled-assets/$resourcePath").map(string => StyleContent(Html(string)))
  }

}

case class AssetNotFoundException(assetPath: RefPath)
  extends Exception(s"Cannot find asset $assetPath. You should run `yarn run build-dev`.")
