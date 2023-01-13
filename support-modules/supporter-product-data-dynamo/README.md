# supporter-product-data-dynamo
This library provides a standard means of adding records to the SupporterProductData dynamo store. 
It is releasable via Maven/Sonatype to allow us to use it from support-service-lambdas 

Releasing to local repo
==================

Run `sbt publishLocal`.


Releasing to maven
==================

We use sbt to release to Maven. This document describes the setup steps required to enable you to release:
https://docs.google.com/document/d/1rNXjoZDqZMsQblOVXPAIIOMWuwUKe3KzTCttuqS7AcY/edit#

1. You should run the release on your local branch not `main` - this is because the final release step updates the library versions then commits and pushes the changes and this will not work on main as it is protected.
2. Ensure that your branch is up to date with `main` in case of regressions - to do this you should run `git pull origin main` and fix any merge conflicts
3. Run ` sbt "project supporter-product-data-dynamo" release` and follow the instructions - you will have to enter the passphrase for your pgp key during the process
4. Make a PR and merge your branch to `main`

Library usage
=================

```scala
import com.gu.supporterdata.model.Stage.{DEV, PROD, UAT}
import com.gu.supporterdata.model.{Stage, SupporterRatePlanItem}
import com.gu.supporterdata.services.SupporterDataDynamoService
import java.time.LocalDate
import scala.concurrent.ExecutionContext.Implicits.global

val dynamoService = SupporterDataDynamoService(DEV)

dynamoService
  .writeItem(
    SupporterRatePlanItem(
      subscriptionName = "usually_zuora_subscription_number",
      identityId = "12345",
      gifteeIdentityId = None,
      productRatePlanId = "8ad09fc281de1ce70181de3b251736a4",
      productRatePlanName = "Supporter Plus Monthly",
      termEndDate = LocalDate.now().plusYears(1),
      contractEffectiveDate = LocalDate.now(),
      contributionAmount = None,
    ),
  )
  .map(_ => println("Successfully wrote item to Dynamo"))
  .recover { case err: Throwable =>
    println(s"An error occurred: ${err.getMessage}")
  }

```