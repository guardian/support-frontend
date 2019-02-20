package utils
  import scala.util.Random

object QueryStringUtils {
  def addFormDesignTestParameterQueryString(queryString: Map[String, Seq[String]]): Map[String, Seq[String]] = {
    val formDesignTestParameterValue = if (Random.nextFloat <= 0.2) "control" else "variant"
   queryString + ("formDesignTest" -> Seq(formDesignTestParameterValue))
  }
}
