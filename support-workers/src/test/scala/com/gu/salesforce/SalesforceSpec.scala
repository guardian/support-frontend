package com.gu.salesforce

import com.gu.config.Configuration
import com.gu.i18n.{Country, Title}
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.salesforce.Fixtures._
import com.gu.salesforce.Salesforce.{
  Authentication,
  DeliveryContact,
  NewContact,
  SalesforceContactSuccess,
  SalesforceErrorResponse,
}
import com.gu.support.workers
import com.gu.support.workers.{Address, GiftRecipient}
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.concurrent.PatienceConfiguration.Timeout
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatest.concurrent.{Eventually, ScalaFutures}
import org.scalatest.time.{Millis, Seconds, Span}

import scala.concurrent.duration._
import scala.util.{Failure, Success}

@IntegrationTest
class SalesforceSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  val customer: NewContact = NewContact(
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
  )

  "AuthService" should "be able to retrieve an authtoken" in {
    val authService = new AuthService(Configuration.load().salesforceConfigProvider.get())

    authService.authorize.map { auth =>
      auth.access_token.length should be > 0
    }
  }

  it should "reuse that token" in {
    val config = Configuration.load().salesforceConfigProvider.get()

    val futureAuths = for {
      auth <- AuthService.getAuth(config)
      auth2 <- AuthService.getAuth(config)
    } yield (auth, auth2)

    futureAuths.map { auths: (Authentication, Authentication) =>
      auths._1.issued_at.getMillis should be(auths._2.issued_at.getMillis)
      auths._1.access_token should be(auths._2.access_token)
    }
  }

  "SalesforceService" should "be able to upsert a customer" in {
    val service =
      new SalesforceService(Configuration.load().salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    service.upsert(customer).map { response: SalesforceContactSuccess =>
      response.Success shouldBe true
      response.ContactRecord.Id shouldBe salesforceId
      response.ContactRecord.AccountId shouldBe salesforceAccountId
    }
  }

  it should "be able to upsert a customer that has optional fields" in {
    val service =
      new SalesforceService(Configuration.load().salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    val upsertData = customer.copy(
      OtherStreet = Some(street),
      OtherCity = Some(city),
      OtherPostalCode = Some(postCode),
      OtherCountry = uk,
      MailingStreet = Some(street),
      MailingCity = Some(city),
      MailingPostalCode = Some(postCode),
      MailingCountry = Some(uk),
      Phone = Some(telephoneNumber),
    )

    service.upsert(upsertData).map { response: SalesforceContactSuccess =>
      response.Success shouldBe true
      response.ContactRecord.Id shouldBe salesforceId
      response.ContactRecord.AccountId shouldBe salesforceAccountId
    }
  }

  it should "be able to add a related contact record" in {
    val service =
      new SalesforceService(Configuration.load().salesforceConfigProvider.get(), configurableFutureRunner(10.seconds))

    val name = "integration-test-recipient"
    val upsertData = DeliveryContact(
      AccountId = salesforceAccountId,
      Email = Some("integration-test-recipient@thegulocal.com"),
      Salutation = Some(Title.Dr),
      FirstName = name,
      LastName = name,
      MailingStreet = Some(street),
      MailingCity = Some(city),
      MailingState = None,
      MailingPostalCode = Some(postCode),
      MailingCountry = Some(uk),
    )

    service.upsert(upsertData).map { response: SalesforceContactSuccess =>
      response.Success shouldBe true
      response.ContactRecord.AccountId shouldBe salesforceAccountId
    }
  }

  "NewContact" should "only include delivery fields for purchases without a gift recipient" in {
    val address = Address(Some(street), None, Some(city), None, Some(postCode), Country.UK)
    val user = workers.User(idId, emailAddress, Some(title), name, name, address, Some(address))

    val newContactNoGift = NewContact.forUser(user, None)

    newContactNoGift.MailingStreet shouldBe Some(street)

    val newContactWithGift = NewContact.forUser(user, Some(GiftRecipient.WeeklyGiftRecipient(None, "", "", None)))

    newContactWithGift.MailingStreet shouldBe None
  }
}
