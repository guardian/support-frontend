package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

object ContributionsLanding extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/uk/contribute"

  private val contributeButton = id("qa-contribute-button")

  def pageHasLoaded: Boolean = pageHasElement(contributeButton)

  def clickContribute: Unit = clickOn(contributeButton)

}
