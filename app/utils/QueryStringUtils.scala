package utils
import scala.util.Random

object QueryStringUtils {
  def addServerSideRenderingTestParameterQueryString(queryString: Map[String, Seq[String]]): Map[String, Seq[String]] = {
    val ssrParameterValue = if (Random.nextBoolean()) "on" else "off"
    queryString + ("ssrTwo" -> Seq(ssrParameterValue))
  }
}
