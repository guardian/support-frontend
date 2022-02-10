package com.gu

import java.io.IOException

import com.gu.monitoring.SafeLogger
import okhttp3._

import scala.concurrent.{Future, Promise}

package object okhttp {

  implicit class RichOkHttpClient(client: OkHttpClient) {

    def execute(request: Request): Future[Response] = {
      val p = Promise[Response]()

      client
        .newCall(request)
        .enqueue(new Callback {
          override def onFailure(call: Call, e: IOException) {
            val sanitizedUrl = s"${request.url().uri().getHost}${request.url().uri().getPath}" // don't log query string
            SafeLogger.warn(s"okhttp request failure: ${request.method()} $sanitizedUrl", e)
            p.failure(e)
          }

          override def onResponse(call: Call, response: Response) {
            p.success(response)
          }
        })

      p.future
    }

  }

}
