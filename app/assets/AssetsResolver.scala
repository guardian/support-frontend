package assets

import play.api.Environment
import play.api.libs.json._

class AssetsResolver(base: String, mapResource: String, env: Environment) {

  def apply(path: String): String =
    lookup.get(path).map(base + _).getOrElse(throw AssetNotFoundException(path))

  private lazy val lookup: Map[String, String] = {
    for {
      rawResource <- loadResource(mapResource)
      mappings <- parseJson(rawResource)
    } yield mappings
  } getOrElse Map.empty

  private def loadResource(path: String) =
    env.resourceAsStream(path).map {
      scala.io.Source.fromInputStream(_).mkString
    }

  private def parseJson(json: String): Option[Map[String, String]] =
    Json.parse(json).validate[Map[String, String]].asOpt
}

case class AssetNotFoundException(assetPath: String)
  extends Exception(s"Cannot find asset $assetPath. You should run `npm run build-dev`.")