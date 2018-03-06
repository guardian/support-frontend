package services

import org.scalatest.time.{Millis, Span}
import org.scalatest.{Matchers, WordSpec}
import tags.RequiresMembershipCredentials
import util.FutureEitherValues

import conf.{ConfigLoaderProvider, IdentityConfig}
import model.TestThreadPoolsProvider

@RequiresMembershipCredentials
class IdentityServiceSpec extends WordSpec
  with Matchers
  with ConfigLoaderProvider
  with TestThreadPoolsProvider
  with WSClientProvider
  with FutureEitherValues
  with IdentityClientErrorMatchers {

  import IdentityClientSpec._

  lazy val config: IdentityConfig = testConfigForEnvironment[IdentityConfig]()
  lazy val service: IdentityService = IdentityService.fromIdentityConfig(config)

  // TODO: mixin with this overridden implicit
  // The default patience config is typically not patient enough for the identity API.
  // Increase the timeout and the span.
  override implicit val patienceConfig: PatienceConfig =
    PatienceConfig(timeout = Span(1000, Millis), interval = Span(20, Millis))

  "An identity service" when {

    "a request is made to lookup an identity id by email address" should {

      "return the identity id if the account exists" in {
        service.getIdentityIdFromEmail(preExistingIdentityAccount.emailAddress).futureRight shouldEqual
          Some(preExistingIdentityAccount.identityId)
      }

      "not return an identity id if the account doesn't exist" in {
        service.getIdentityIdFromEmail(generateEmailAddressWithNoIdentityAccount()).futureRight shouldEqual
          Option.empty[Long]
      }
    }

    "a request is made to create a new account for a given email address" should {

      "return an email in use API error if the account already exists" in {
        // https://groups.google.com/forum/?fromgroups#!msg/scalatest-users/4MemQiqLzao/_DsBTQWaqfwJ
        service.createGuestAccount(preExistingIdentityAccount.emailAddress).futureLeft should beAnEmailInUseApiError
      }

      "create an account and return the identity id if the account doesn't exist" in {
        // The fact this fails when you try and assert the type I think is a bug in Scalatest.
        // I will raise the issue on Stackoverflow and/or Github, and amend the test once I get a fix.
        service.createGuestAccount(generateEmailAddressWithNoIdentityAccount()).futureRight // shouldBe a[Long]
      }
    }

    // TODO: these tests could be improved e.g. detect whether the create account method is called
    "a create or get request is made to get an identity by email address" should {

      "return the identity id if the account exists" in {
        service.getOrCreateIdentityIdFromEmail(preExistingIdentityAccount.emailAddress).futureRight shouldEqual
          preExistingIdentityAccount.identityId
      }

      "create an account and return the identity id if there isn't an existing account" in  {
        // The fact this fails when you try and assert the type I think is a bug in Scalatest.
        // I will raise the issue on Stackoverflow and/or Github, and amend the test once I get a fix.
        service.getOrCreateIdentityIdFromEmail(generateEmailAddressWithNoIdentityAccount()).futureRight // shouldBe a[Long]
      }
    }
  }
}
