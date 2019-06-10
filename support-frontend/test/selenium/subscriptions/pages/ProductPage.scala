package selenium.subscriptions.pages

import org.scalatest.selenium.Page

trait ProductPage extends Page {
  def pageHasLoaded: Boolean
}
