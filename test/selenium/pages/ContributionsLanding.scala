package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

case class ContributionsLanding(region: String) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/$region/contribute"

  private val contributeButton = id("qa-contribute-button")

  def pageHasLoaded: Boolean = pageHasElement(contributeButton)

  def clickContribute: Unit = clickOn(contributeButton)

}
