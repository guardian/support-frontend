package com.gu.conf

import java.time.ZonedDateTime

case class ZuoraQuerierConfig(
    url: String,
    partnerId: String,
    username: String,
    password: String,
    discountProductRatePlanIds: List[String],
    lastSuccessfulQueryTime: Option[ZonedDateTime],
)
