package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{HomeDelivery, NationalDelivery, Paper}
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.paperround.AgentsEndpoint.AgentDetails
import com.gu.support.workers.ProductTypeRatePlans.paperRatePlan
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailPaperState

import scala.concurrent.{ExecutionContext, Future}

class PaperEmailFields(
    paperFieldsGenerator: PaperFieldsGenerator,
    touchPointEnvironment: TouchPointEnvironment,
) {

  def build(paper: SendThankYouEmailPaperState, deliveryAgentDetails: Option[AgentDetails])(implicit
      ec: ExecutionContext,
  ): Future[EmailFields] = {

    val additionalFields = List(
      "package" -> paper.product.productOptions.toString,
      "delivery_agent_name" -> deliveryAgentDetails.map(_.agentName).getOrElse(""),
      "delivery_agent_telephone" -> deliveryAgentDetails.map(_.telephone).getOrElse(""),
      "delivery_agent_email" -> deliveryAgentDetails.map(_.email).getOrElse(""),
      "delivery_agent_address1" -> deliveryAgentDetails.map(_.address1).getOrElse(""),
      "delivery_agent_address2" -> deliveryAgentDetails.map(_.address2).getOrElse(""),
      "delivery_agent_town" -> deliveryAgentDetails.map(_.town).getOrElse(""),
      "delivery_agent_county" -> deliveryAgentDetails.map(_.county).getOrElse(""),
      "delivery_agent_postcode" -> deliveryAgentDetails.map(_.postcode).getOrElse(""),
    )

    val dataExtension: String = paper.product.fulfilmentOptions match {
      case HomeDelivery => "paper-delivery"
      case NationalDelivery => "paper-national-delivery"
      case _ => "paper-subscription-card"
    }

    paperFieldsGenerator
      .fieldsFor(
        paper.paymentMethod,
        paper.paymentSchedule,
        paper.promoCode,
        paper.accountNumber,
        paper.subscriptionNumber,
        paper.product,
        paper.user,
        paperRatePlan(paper.product, touchPointEnvironment).map(_.id),
        fixedTerm = false,
        paper.firstDeliveryDate,
      )
      .map(fields => EmailFields(fields ++ additionalFields, paper.user, dataExtension))
  }
}
