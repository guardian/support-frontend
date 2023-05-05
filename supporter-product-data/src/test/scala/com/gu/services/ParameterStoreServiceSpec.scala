package com.gu.services

import com.gu.supporterdata.model.Stage.CODE
import com.gu.test.tags.annotations.IntegrationTest
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@IntegrationTest
class ParameterStoreServiceSpec extends AsyncFlatSpec with Matchers {

  ParameterStoreService.getClass.getSimpleName should "be able to put and get a parameter" in {
    val paramName = "integrationTestParam"
    val paramVal = LocalDateTime.now.format(DateTimeFormatter.ISO_DATE_TIME)
    val service = ParameterStoreService(CODE)
    for {
      _ <- service.putParameter(paramName, paramVal)
      result <- service.getParameter(paramName)
    } yield result shouldBe paramVal
  }
}
