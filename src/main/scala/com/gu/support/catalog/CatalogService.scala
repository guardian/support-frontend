package com.gu.support.catalog

import AwsS3Client.{fetchJson, s3}
import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.support.config.Stage

object CatalogService{
  def apply(stage: Stage): CatalogService = new CatalogService(stage)
}

class CatalogService(stage: Stage) {

  def getCatalog = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    fetchJson(s3, catalog).flatMap { c =>
      val attempt = c.as[Catalog]
      attempt.toOption
    }
  }

//  def getPrintCatalog = getCatalog
//    .flatMap(_.products)
//    .flatMap(_.productRatePlans)
//    .flatMap(_.productRatePlanCharges)
//    .filter(charge => charge.ProductType__c.contains(PaperDay))

}
