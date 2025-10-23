package utils

object ObserverUtils {
  def isObserverSubdomain(host: String): Boolean = {
    host.split("""\.""").headOption.contains("observer")
  }
}
