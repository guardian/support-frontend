package com.gu.acquisition.services

import com.gu.acquisition.model.errors.AnalyticsServiceError.BuildError
import com.gu.acquisition.model.{AcquisitionSubmission, SyntheticPageviewId}
import com.gu.acquisition.services.AnalyticsService.RequestData
import okhttp3._

/**
  * Build an acquisition submission, and submit it to Ophan.
  * Uses OkHttp for executing the Http request.
  */
private [acquisition] class OphanService(implicit client: OkHttpClient)
  extends AnalyticsService {

  private val endpoint: HttpUrl = HttpUrl.parse("https://ophan.theguardian.com")

  private def cookieValue(visitId: Option[String], browserId: Option[String]): String =
    List(visitId.map(("vsid", _)), browserId.map(("bwid", _))).flatten
      .map { case (name, value) => name + "=" + value }
      .mkString(";")

  override def buildRequest(submission: AcquisitionSubmission): Either[BuildError, RequestData] = {
    import com.gu.acquisition.instances.acquisition._
    import io.circe.syntax._
    import submission._

    val url = endpoint.newBuilder()
      .addPathSegment("a.gif")
      .addQueryParameter("viewId", ophanIds.pageviewId.getOrElse(SyntheticPageviewId.generate))
      .addQueryParameter("acquisition" , acquisition.asJson.noSpaces)
      .build()

    val request = new Request.Builder()
      .url(url)
      .addHeader("Cookie", cookieValue(ophanIds.visitId, ophanIds.browserId))
      .build()

    Right(RequestData(request, submission))
  }


}

