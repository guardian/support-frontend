package utils
import scala.util.Random

object QueryStringUtils {
  def addServerSideRenderingTestParameterQueryString(queryString: Map[String, Seq[String]]): Map[String, Seq[String]] = {
    val formDesignTestParameterValue = if (Random.nextBoolean()) "control" else "variant"
   queryString + ("formDesignTest" -> Seq(formDesignTestParameterValue))
  }
}
