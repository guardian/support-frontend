import sbt.{Test, config}

object SeleniumTestConfig {

  lazy val SeleniumTest = config("selenium") extend Test

  def seleniumTestFilter(name: String): Boolean = name startsWith "selenium"

  def unitTestFilter(name: String): Boolean = !seleniumTestFilter(name)

}
