package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.helpers.Handler
import com.gu.support.workers.model.SalesForceContact
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

class CreateZuoraSubscription extends Handler[SalesForceContact, String] with LazyLogging {
  override protected def handler(input: SalesForceContact, context: Context) = "success"
}
