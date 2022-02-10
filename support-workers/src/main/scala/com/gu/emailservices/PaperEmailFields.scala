package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{HomeDelivery, Paper}
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers.ProductTypeRatePlans.paperRatePlan
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailPaperState

import scala.concurrent.{ExecutionContext, Future}

class PaperEmailFields(
    paperFieldsGenerator: PaperFieldsGenerator,
    touchPointEnvironment: TouchPointEnvironment,
) {

  def build(paper: SendThankYouEmailPaperState)(implicit ec: ExecutionContext): Future[EmailFields] = {

    val additionalFields = List("package" -> paper.product.productOptions.toString)

    val dataExtension: String = paper.product.fulfilmentOptions match {
      case HomeDelivery => "paper-delivery"
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
