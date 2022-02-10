package services

import java.util.UUID

import org.scalatest.time.{Millis, Span}
import util.FutureEitherValues
import conf.{ConfigLoaderProvider, IdentityConfig}
import model.TestThreadPoolsProvider
import org.scalatest.Ignore
import org.scalatest.matchers.must.Matchers
import org.scalatest.wordspec.AnyWordSpec
import services.IdentityClient.{GuestRegistrationResponse, UserResponse}
import services.IdentityClient.UserResponse.User

@Ignore
class IdentityClientSpec
    extends AnyWordSpec
    with Matchers
    with ConfigLoaderProvider
    with TestThreadPoolsProvider
    with WSClientProvider
    with FutureEitherValues
    with IdentityClientErrorMatchers {

  import IdentityClientSpec._

  lazy val config: IdentityConfig = configForTestEnvironment[IdentityConfig]()
  lazy val client: IdentityClient = IdentityClient.fromIdentityConfig(config)

  // TODO: mixin with this overridden implicit
  // The default patience config is typically not patient enough for the identity API.
  // Increase the timeout and the span.
  override implicit val patienceConfig: PatienceConfig =
    PatienceConfig(timeout = Span(1000, Millis), interval = Span(20, Millis))

  "An identity client" when {

    "a request is made to lookup user details by email address" should {

      "return them if there is an existing account" in {
        client.getUser(preExistingIdentityAccount.emailAddress).futureRight mustEqual
          UserResponse(user = User(id = preExistingIdentityAccount.identityId))
      }

      "return a not found API error if there is not an existing account" in {
        client.getUser(generateEmailAddressWithNoIdentityAccount()).futureLeft must beANotFoundApiError
      }
    }

    "a request is made to create a guest account for an email address" should {

      "return an email in use API error if an account already exists" in {
        client.createGuestAccount(preExistingIdentityAccount.emailAddress).futureLeft must beAnEmailInUseApiError
      }

      "create one if an account doesn't exist" in {
        client.createGuestAccount(generateEmailAddressWithNoIdentityAccount()).futureRight mustBe
          a[GuestRegistrationResponse]
      }
    }

    "used to create a new guest account, the account" should {

      "be able to be looked up by email address" in {
        val emailAddress = generateEmailAddressWithNoIdentityAccount()
        val identityId = client.createGuestAccount(emailAddress).futureRight.guestRegistrationRequest.userId
        client.getUser(emailAddress).futureRight.user.id mustEqual identityId
      }
    }
  }
}

object IdentityClientSpec {

  case class PreExistingIdentityAccount(emailAddress: String, identityId: Long)

  // An account for this email address has been created on the identity CODE environment.
  val preExistingIdentityAccount = PreExistingIdentityAccount(
    emailAddress = "test.user@payment-api.gu.com",
    identityId = 100000253L,
  )

  def generateEmailAddressWithNoIdentityAccount(): String =
    s"${UUID.randomUUID}@payment-api.gu.com"
}
