package controllers

import actions.CustomActionBuilders
import assets.{AssetsResolver, RefPath}
import com.gu.identity.model.{PublicFields, User}
import com.gu.support.config.Stages
import fixtures.TestCSRFComponents
import org.scalatestplus.mockito.MockitoSugar._
import play.api.Environment
import play.api.test.Helpers._
import play.twirl.api.Html
import services._

import scala.concurrent.ExecutionContext.Implicits.global

trait DisplayFormMocks extends TestCSRFComponents {

  val authenticatedIdUser = User("testuser@gu.com", "123")

  val testUsers = new TestUserService("test") {
    override def isTestUser(testUserName: Option[String]): Boolean = testUserName.exists(_.startsWith("test"))
  }

  val assetResolver = new AssetsResolver("", "", mock[Environment]) {
    override def apply(path: String): String = path
    override def apply(path: RefPath): String = path.value
    override protected def loadSsrHtmlCache: Map[String,Html] = Map()
  }

  val idUser = User(
    id = "123",
    primaryEmailAddress = "test@gu.com",
    publicFields = PublicFields(displayName = Some("test-user"))
  )

  val asyncAuthenticationService = mock[AsyncAuthenticationService]

  val stage = Stages.DEV

  val loggedInActionRefiner = new CustomActionBuilders(
    asyncAuthenticationService,
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig,
    stage = stage
  )

}
