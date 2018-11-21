package services

import services.aws.AwsS3Client.{fetchJson, s3}
import com.amazonaws.services.s3.model.GetObjectRequest
import com.gu.support.config.{Stage, Stages}
import io.circe.generic.auto._
import io.circe.syntax._
import models.Catalog._

object CatalogService {

  val paperCollectionProductRatePlanIds = List(
    "2c92a0ff56fe33f00157040f9a537f4b",
    "2c92a0fe5af9a6b9015b0fe1ecc0116c",
    "2c92a0fd56fe270b0157040e42e536ef",
    "2c92a0fd56fe270b0157040dd79b35da"
  )

  val paperDeliveryProductRatePlanIds = List(
    "2c92a0ff5af9b657015b0fea5b653f81",
    "2c92a0fd5614305c01561dc88f3275be",
    "2c92a0ff560d311b0156136f2afe5315",
    "2c92a0fd560d13880156136b72e50f0c"
  )

  def getCatalog(stage: Stage): Option[Catalog] = {
    val catalog = new GetObjectRequest(s"gu-zuora-catalog/$stage/Zuora-$stage", "catalog.json")
    fetchJson(s3, catalog).flatMap(
      _.as[Catalog].toOption
    )
  }

  def getPaperPrices: PaperPrices = getCatalog(Stages.PROD).map {
    catalog =>
      PaperPrices(
        PricePlan.build(catalog, paperCollectionProductRatePlanIds),
        PricePlan.build(catalog, paperDeliveryProductRatePlanIds)
      )
  }.getOrElse(PaperPrices.empty)

}
