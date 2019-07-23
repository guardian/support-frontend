package controllers

import actions.CustomActionBuilders

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import cats.data.EitherT
import cats.implicits._
import org.scalatest.mockito.MockitoSugar._
import org.mockito.Mockito.when
import org.mockito.ArgumentMatchers.{any, eq => argEq}
import play.api.test.Helpers._
import play.api.mvc.RequestHeader
import play.api.Environment
import assets.{AssetsResolver, RefPath}
import com.gu.identity.play.PublicFields
import com.gu.identity.play.{AccessCredentials, AuthenticatedIdUser, IdMinimalUser, IdUser}
import config.Configuration.IdentityUrl
import services._
import services.MembersDataService._
import fixtures.TestCSRFComponents
import play.twirl.api.Html

trait DisplayFormMocks extends TestCSRFComponents {
  val credentials = AccessCredentials.Cookies("", None)

  val authenticatedIdUser = AuthenticatedIdUser(credentials, IdMinimalUser("123", Some("test-user")))

  val testUsers = new TestUserService("test") {
    override def isTestUser(displayName: Option[String]): Boolean = displayName.exists(_.startsWith("test"))
  }

  val assetResolver = new AssetsResolver("", "", mock[Environment]) {
    override def apply(path: String): String = path
    override def apply(path: RefPath): String = path.value
    override protected def loadSsrHtmlCache: Map[String,Html] = Map()
  }

  val idUser = IdUser("123", "test@gu.com", PublicFields(Some("test-user")), None, None)

  val asyncAuthenticationService = mock[AsyncAuthenticationService]

  val loggedInActionRefiner = new CustomActionBuilders(
    asyncAuthenticationService,
    idWebAppUrl = IdentityUrl(""),
    supportUrl = "",
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig
  )

  val loggedOutActionRefiner = new CustomActionBuilders(
    asyncAuthenticationService,
    idWebAppUrl = IdentityUrl("https://identity-url.local"),
    supportUrl = "",
    cc = stubControllerComponents(),
    addToken = csrfAddToken,
    checkToken = csrfCheck,
    csrfConfig = csrfConfig
  )

  def mockedMembersDataService(data: (AccessCredentials.Cookies, Either[MembersDataServiceError, UserAttributes])): MembersDataService = {
    val membersDataService = mock[MembersDataService]
    when(
      membersDataService.userAttributes(data._1)
    ).thenReturn(EitherT.fromEither[Future](data._2))
    membersDataService
  }

  def mockedIdentityService(data: (IdMinimalUser, Either[String, IdUser])): IdentityService = {
    val m = mock[IdentityService]
    when(
      m.getUser(argEq(data._1))(any[RequestHeader], any[ExecutionContext])
    ).thenReturn(EitherT.fromEither[Future](data._2))
    m
  }
}
