package com.gu.support.paperround

import com.gu.okhttp.RequestRunners.{FutureHttpClient, futureRunner}
import com.gu.rest.WebServiceHelper
import com.gu.support.config.{PaperRoundConfig, PaperRoundConfigProvider}
import com.gu.support.paperround.PaperRound
import com.gu.support.paperround.{AgentsEndpoint, CoverageEndpoint, ChargeBandsEndpoint}
import com.gu.support.touchpoint.{TouchpointService, TouchpointServiceProvider}

import scala.concurrent.{ExecutionContext, Future}

class PaperRoundServiceProvider(configProvider: PaperRoundConfigProvider)(implicit ec: ExecutionContext)
    extends TouchpointServiceProvider[PaperRoundService, PaperRoundConfig](configProvider) {
  override protected def createService(config: PaperRoundConfig) = {
    new PaperRoundService(config, futureRunner)
  }
}

class PaperRoundService(config: PaperRoundConfig, client: FutureHttpClient)(implicit
    executionContext: ExecutionContext,
) extends WebServiceHelper[PaperRound.Error]
    with PaperRoundAPI
    with TouchpointService {
  override val wsUrl: String = config.apiUrl
  override val httpClient: FutureHttpClient = client

  def coverage(body: CoverageEndpoint.RequestBody): Future[CoverageEndpoint.Response] = {
    postForm[CoverageEndpoint.Response](
      endpoint = "coverage",
      data = Map("postcode" -> List(body.postcode)),
      headers = Map("x-api-key" -> config.apiKey),
    )
  }

  def agents(): Future[AgentsEndpoint.Response] = {
    postForm[AgentsEndpoint.Response](
      endpoint = "agents",
      data = Map.empty,
      headers = Map("x-api-key" -> config.apiKey),
    )
  }

  def chargebands(): Future[ChargeBandsEndpoint.Response] = {
    postForm[ChargeBandsEndpoint.Response](
      endpoint = "chargebands",
      data = Map.empty,
      headers = Map("x-api-key" -> config.apiKey),
    )
  }
}
