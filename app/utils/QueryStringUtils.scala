package utils
  import scala.util.Random

object QueryStringUtils {
  def addFormDesignTestParameterQueryString(queryString: Map[String, Seq[String]]): Map[String, Seq[String]] = {
   queryString + ("formDesignTest" -> Seq("variant"))
  }
}
