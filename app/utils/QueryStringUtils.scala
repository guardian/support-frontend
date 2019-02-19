package utils
import scala.util.Random

object QueryStringUtils {
  def addServerSideRenderingTestParameterQueryString(queryString: Map[String, Seq[String]]): Map[String, Seq[String]] = {
    val ssrParameterValue = if (Random.nextBoolean()) "on" else "off"
    val formDesignTestParameterValue = if (Random.nextBoolean()) "control" else "variant"
   queryString + ("ssrTwo" -> Seq(ssrParameterValue)) + ("formDesignTest" -> Seq(formDesignTestParameterValue))
  }
}
