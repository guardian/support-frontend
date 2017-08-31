package services

import cats.data.EitherT
import com.netaporter.uri.Uri
import ophan.thrift.event.Acquisition
import utils.AcquisitionUtils

import scalaj.http._
import scala.concurrent.{ExecutionContext, Future}

class OphanService(implicit ec: ExecutionContext) {
  private val url = "https://ophan.theguardian.com"
  private val endpoint = "a.gif"

  def submit(
    acquisition: Acquisition,
    browserId: String,
    viewId: String,
    visitId: Option[String]
  ): EitherT[Future, String, HttpResponse[String]] = {
    val cookies: String = Map("bwid" -> Some(browserId), "vsid" -> visitId)
      .collect { case (k, Some(v)) => s"$k=$v" }.mkString(";")

    val params: Map[String, String] = AcquisitionUtils.queryParamsFor(acquisition) + ("viewId" -> viewId)

    val request: HttpRequest = Http(url(params)).header("Cookie", cookies)

     EitherT(Future(request.asString).map { response =>
      if (response.isSuccess) Right(response)
      else Left(s"Ophan request failed: ${response.body} (HTTP ${response.code})")
    })
  }

  private[services] def url(params: Map[String, String]): String =
    Uri.parse(s"$url/$endpoint").addParams(params.toSeq).toString
}
