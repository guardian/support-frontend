package utils

object QueryStringUtils {
  def addServerSideRenderingTestParameterQueryString(queryString: Map[String, Seq[String]]): Map[String, Seq[String]] = {
    val ssrParamterValue = if (math.random() < 0.5) "on" else "off"
    queryString ++ List("ssr" -> Seq(ssrParamterValue))
  }
}
