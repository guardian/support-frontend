package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.i18n.Title
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{Authentication, DeliveryContact, NewContact, SalesforceContactResponse}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{AsyncFlatSpec, Matchers}

import scala.concurrent.duration._

@IntegrationTest
class SalesforceSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  implicit override def executionContext = scala.concurrent.ExecutionContext.Implicits.global

  val customer = NewContact(
    IdentityID__c = idId,
    Email = emailAddress,
    Salutation = Some(Title.Mr),
    FirstName = name,
    LastName = name,
    OtherStreet = None,
    OtherCity = None,
    OtherState = None,
    OtherPostalCode = None,
    OtherCountry = uk,
    MailingStreet = None,
    MailingCity = None,
    MailingState = None,
    MailingPostalCode = None,
    MailingCountry = None,
    Phone = None,
    Allow_Membership_Mail__c = allowMail,
    Allow_3rd_Party_Mail__c = allowMail,
    Allow_Guardian_Related_Mail__c = allowMail
  )

  "AuthService" should "be able to retrieve an authtoken" in {
    val authService = new AuthService(Configuration.salesforceConfigProvider.get())

    authService.authorize.map { auth =>
      auth.access_token.length should be > 0
    }
  }

  it should "reuse that token" in {
    val config = Configuration.salesforceConfigProvider.get()

    val futureAuths = for {
      auth <- AuthService.getAuth(config)
      auth2 <- AuthService.getAuth(config)
    } yield (auth, auth2)

    futureAuths.map { auths: (Authentication, Authentication) =>
      auths._1.issued_at.getMillis should be(auths._2.issued_at.getMillis)
      auths._1.access_token should be(auths._2.access_token)
    }
  }

  it should "get a different auth token for each stage" in {
    val config = Configuration.salesforceConfigProvider.get()

    val futureAuths = for {
      devAuth <- AuthService.getAuth(Configuration.salesforceConfigProvider.get())
      uatAuth <- AuthService.getAuth(Configuration.salesforceConfigProvider.get(true))
    } yield (devAuth, uatAuth)

    futureAuths.map { auths: (Authentication, Authentication) =>
      auths._1.access_token should not be auths._2.access_token
    }
  }

  "SalesforceService" should "be able to upsert a customer" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    service.upsert(customer).map { response: SalesforceContactResponse =>
      response.Success shouldBe true
      response.ContactRecord.Id shouldBe salesforceId
      response.ContactRecord.AccountId shouldBe salesforceAccountId
    }
  }

  it should "be able to upsert a customer that has optional fields" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    val upsertData = customer.copy(
      OtherStreet = Some(street),
      OtherCity = Some(city),
      OtherPostalCode = Some(postCode),
      OtherCountry = uk,
      MailingStreet = Some(street),
      MailingCity = Some(city),
      MailingPostalCode = Some(postCode),
      MailingCountry = Some(uk),
      Phone = Some(telephoneNumber)
    )

    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      response.Success shouldBe true
      response.ContactRecord.Id shouldBe salesforceId
      response.ContactRecord.AccountId shouldBe salesforceAccountId
    }
  }

  it should "be able to add a related contact record" in {
    val service = new SalesforceService(Configuration.salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    val name = "integration-test-recipient"
    val upsertData = DeliveryContact(
      AccountId = salesforceAccountId,
      Email = Some("integration-test-recipient@gu.com"),
      Salutation = Some(Title.Ms),
      FirstName = name,
      LastName = name,
      MailingStreet = Some(street),
      MailingCity = Some(city),
      MailingState = None,
      MailingPostalCode = Some(postCode),
      MailingCountry = Some(uk)
    )

    service.upsert(upsertData).map { response: SalesforceContactResponse =>
      response.Success shouldBe true
      response.ContactRecord.AccountId shouldBe salesforceAccountId
    }
  }
}
