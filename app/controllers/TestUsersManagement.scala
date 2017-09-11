package controllers

import actions.CacheControl
import play.api.mvc._
import services.TestUserService
import com.gu.googleauth.AuthAction

import scala.concurrent.ExecutionContext
import views.html.{testUsers => testUsersView}

class TestUsersManagement(
    authAction: AuthAction[AnyContent],
    components: ControllerComponents,
    testUsers: TestUserService,
    supportUrl: String
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  private val cookieDomain = supportUrl.stripPrefix("https://").stripPrefix("support")

  def createTestUser: Action[AnyContent] = authAction {
    val testUser = testUsers.testUsers.generate()
    Ok(testUsersView(testUser))
      .withHeaders(CacheControl.noCache)
      .withCookies(Cookie("_test_username", testUser, httpOnly = false, domain = Some(cookieDomain)))
  }
}
