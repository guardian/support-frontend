import sbt.Keys.testOptions
import sbt.{Test, Tests, config}

object SeleniumTestConfig {

  lazy val SeleniumTest = config("selenium") extend(Test)

  def seleniumTestFilter(name: String): Boolean = name startsWith "selenium"

  def unitTestFilter(name: String): Boolean = !seleniumTestFilter(name)

  testOptions in SeleniumTest := Seq(Tests.Filter(seleniumTestFilter))

  testOptions in Test := Seq(Tests.Filter(unitTestFilter))


}
