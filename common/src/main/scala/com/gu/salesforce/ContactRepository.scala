package com.gu.salesforce

import com.gu.salesforce.ContactDeserializer._
import com.typesafe.scalalogging.LazyLogging
import play.api.libs.json._
import cats.syntax.either._

import scala.concurrent.{ExecutionContext, Future}


abstract class ContactRepository(implicit ec: ExecutionContext) extends LazyLogging {

  val salesforce: Scalaforce

  case class ContactRepositoryError(s: String) extends Throwable {
    override def getMessage: String = s
  }

  //userId is an Identity user id
  def upsert(userId: Option[String], values: JsObject): Future[ContactId] = {
    for {
      result <- salesforce.Contact.upsert(userId.map(Keys.IDENTITY_ID -> _), values)
    } yield ContactId(result.Id, result.AccountId)
  }

  //  def updateIdentityId(contact: ContactId, newIdentityId: String): Future[Either[Throwable, Unit]] = {
  //    salesforce.Contact.update(SFContactId(contact.salesforceContactId), Keys.IDENTITY_ID, newIdentityId)
  //      .map(e => e.asRight)
  //      .recover { case e: Throwable => e.asLeft }
  //  }
  //
  //  import com.gu.memsub.subsv2.reads.Trace.{Traceable => T1}
  //  import com.gu.memsub.subsv2.services.Trace.Traceable
  //
  //  private def toEither[A](j: JsResult[A]): Either[String, A] = j.fold(
  //    { errors =>
  //      errors.toString.asLeft
  //    }, _.asRight
  //  )
  //
  //  private def get(key: String, value: String) = {
  //    salesforce.Contact.read(key, value).map { failableJsonContact =>
  //      (for {
  //        resultOpt <- failableJsonContact
  //        aaa <- resultOpt.map { jsValue =>
  //          toEither(jsValue.validate[Contact].withTrace(s"SF001: Invalid read Contact response from Salesforce for $key $value: $jsValue"))
  //            .map(Some.apply)
  //        }.getOrElse(None.asRight)
  //      } yield aaa).withTrace(s"SF002: could not get read contact response for $key $value")
  //    }
  //  }
  //
  //  def get(identityId: String): Future[Option[Contact]] = // this routinely returns None if the person isn't a member
  //    get(Keys.IDENTITY_ID, identityId)
  //      .map(_.leftMap(errors => logger.error(errors)).toOption.flatten /*todo return the either instead of logging*/)
  //
  //  def getByEmail(email: String): Future[Option[Contact]] =
  //    get(Keys.EMAIL, email)
  //      .map(_.leftMap(errors => logger.error(errors)).toOption.flatten /*todo return the either instead of logging*/)
  //
  //  def getByContactId(contactId: String): Future[Either[String, Contact]] =
  //    get(Keys.CONTACT_ID, contactId).map(f => f _.flatMap(_.map(\/-.apply).getOrElse(-\/(s"SF004: contact $contactId 404 not found"))))

}
