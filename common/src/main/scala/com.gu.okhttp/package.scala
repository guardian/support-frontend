package main.scala.com.gu

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

          if (!(sanitizedUrl == "d1s44y2vc5rmbm.cloudfront.net/v3/users/me/owned_events/")) // FIXME: Temporarily disable logging of CloudFront errors to prevent log spamming as we are getting 30000 timeouts per day
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
