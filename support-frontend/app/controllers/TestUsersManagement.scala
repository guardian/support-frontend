package controllers

import actions.CacheControl
import play.api.mvc._
import services.TestUserService
import com.gu.googleauth.AuthAction
import config.Configuration.GuardianDomain

import scala.concurrent.ExecutionContext
import views.html.{testUsers => testUsersView}

class TestUsersManagement(
    authAction: AuthAction[AnyContent],
    components: ControllerComponents,
    testUsers: TestUserService,
    supportUrl: String,
    guardianDomain: GuardianDomain,
)(implicit val ec: ExecutionContext)
    extends AbstractController(components) {

  private val cookieDomain = guardianDomain

  def createTestUser: Action[AnyContent] = authAction { request =>
    val testUser = testUsers.testUsers.generate()
    Ok(testUsersView(testUser, request.user.email.replace("@", s"+$testUser@")))
      .withHeaders(CacheControl.noCache)
      .withCookies(Cookie("_test_username", testUser, httpOnly = false, domain = Some(cookieDomain.value)))
  }
}
