package com.gu

import java.io.IOException
import okhttp3.{Callback, OkHttpClient, Request, Response, Call}
import com.typesafe.scalalogging.LazyLogging
import scala.concurrent.{Future, Promise}

package object okhttp {

  implicit class RickOkHttpClient(client: OkHttpClient) extends LazyLogging {

    def execute(request: Request): Future[Response] = {
      val p = Promise[Response]()

      client.newCall(request).enqueue(new Callback {
        override def onFailure(call: Call, e: IOException) {
          val sanitizedUrl = s"${request.url().uri().getHost}${request.url().uri().getPath}" // don't log query string
          logger.error(s"okhttp request failure: ${request.method()} $sanitizedUrl", e)
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
