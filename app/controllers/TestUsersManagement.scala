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
    testUsers: TestUserService
)(implicit val ec: ExecutionContext) extends AbstractController(components) {

  def createTestUser: Action[AnyContent] = authAction {
    Ok(testUsersView(testUsers.testUsers.generate())).withHeaders(CacheControl.noCache)
  }
}
