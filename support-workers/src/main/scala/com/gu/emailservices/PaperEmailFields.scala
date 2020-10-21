package com.gu.emailservices

import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.catalog.{HomeDelivery, Paper}
import com.gu.support.config.TouchPointEnvironment
import com.gu.support.workers.ProductTypeRatePlans.paperRatePlan
import com.gu.support.workers._
import com.gu.support.workers.states.ProductTypeCreated.PaperCreated

import scala.concurrent.{ExecutionContext, Future}

class PaperEmailFields(
  paperFieldsGenerator: PaperFieldsGenerator,
  touchPointEnvironment: TouchPointEnvironment,
  user: User,
  sfContactId: SfContactId,
) {

  def build(paper: PaperCreated)(implicit ec: ExecutionContext): Future[EmailFields] = {

    val additionalFields = List("package" -> paper.product.productOptions.toString)

    val dataExtension: String = paper.product.fulfilmentOptions match {
      case HomeDelivery => "paper-delivery"
      case _ => if (Paper.useDigitalVoucher) "paper-subscription-card" else "paper-voucher"
    }

    paperFieldsGenerator.fieldsFor(
      paper.purchaseInfo,
      paper.product,
      user,
      paperRatePlan(paper.product, touchPointEnvironment).map(_.id),
      fixedTerm = false,
      paper.firstDeliveryDate,
    ).map(fields =>
      EmailFields(fields ++ additionalFields, Left(sfContactId), user.primaryEmailAddress, dataExtension)
    )
  }
}
