package com.gu.gocardless

import com.gocardless.GoCardlessClient
import com.gocardless.GoCardlessClient.Environment
import com.gu.support.config.GoCardlessConfig
import com.gu.support.gocardless.GoCardlessService

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class GoCardlessWorkersService(config: GoCardlessConfig) extends GoCardlessService(config) {

  lazy val client = GoCardlessClient.create(config.apiToken, Environment.valueOf(config.environment))

  def getCustomerAccountIdFromMandateId(mandateId: String): Future[String] =
    Future {
      client.mandates().get(mandateId).execute()
    } map {
      _.getLinks.getCustomerBankAccount
    }

  case class MandateRefs(mandateId: String, reference: String)

  def createNewMandateOnExistingCustomerAccount(customerAccountId: String): Future[MandateRefs] =
    Future {
      client.mandates().create().withScheme("bacs").withLinksCustomerBankAccount(customerAccountId).execute()
    } map { newMandateDetails =>
      MandateRefs(newMandateDetails.getId, newMandateDetails.getReference)
    }
}
