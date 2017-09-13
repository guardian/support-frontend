package selenium.pages

import org.scalatest.selenium.Page
import selenium.util.{Browser, Config}

case class ContributionsLanding(region: String) extends Page with Browser {

  val url = s"${Config.supportFrontendUrl}/$region/contribute"

  private val contributeButton = id("qa-contribute-button")

  private val contributePayPalButton = id("qa-contribute-paypal-button")

  private val oneOffButton = id("qa-one-off-toggle")

  def pageHasLoaded: Boolean = pageHasElement(contributeButton)

  def clickContribute: Unit = clickOn(contributeButton)

  def clickOneOff: Unit = clickOn(oneOffButton)

  def clickContributePayPalButton: Unit = clickOn(contributePayPalButton)

}
