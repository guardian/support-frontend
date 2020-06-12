package com.gu.zuora

import org.joda.time.{DateTime, DateTimeZone}
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class ZuoraSpec extends AnyFlatSpec with Matchers {

  "zuora service" should "correctly format dates" in {
    // https://knowledgecenter.zuora.com/Central_Platform/Query/ZOQL
    // 2015-02-28T23:54:01-08:00
    val now = new DateTime(2020, 1, 27, 12, 21, 30, DateTimeZone.UTC)
    val queryString = ZuoraService.updatedClause(now)
    queryString should be("UpdatedDate > '2019-12-30T12:21:30Z'")
  }

}
