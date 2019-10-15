package selenium.subscriptions.pages

import org.scalatestplus.selenium.Page

trait ProductPage extends Page {
  def pageHasLoaded: Boolean
}
