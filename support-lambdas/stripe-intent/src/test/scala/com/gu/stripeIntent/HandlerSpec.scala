package com.gu.stripeIntent

import java.nio.charset.Charset

import com.gu.handler.ApiGatewayResponse
import com.gu.support.config.Stages
import okhttp3.{MediaType, Protocol, Request, Response}
import okio.{Buffer, BufferedSource}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers

import scala.jdk.CollectionConverters._
import scala.concurrent.Future

class HandlerSpec extends AsyncFlatSpec with Matchers {

  it should "make the right call to stripe" in {

    val publicKeyToPrivateKey = Map(StripePublicKey("pub") -> StripePrivateKey("priv"))
    val stripeResponse = """{"client_secret": "theSecret", "id": "theID"}"""

    var requests: List[(String, String)] = Nil
    // this is a bit over complicated because we are using okhttp objects which are much more flexible than we need
    val httpOp = { req: Request =>
      val reqBuf = new Buffer()
      req.body().writeTo(reqBuf)
      val authHeaderBodyString =
        req.headers("Authorization").asScala.mkString(",") -> reqBuf.readString(Charset.forName("UTF-8"))
      requests = authHeaderBodyString :: requests // !
      println(s"GOT CALL! $authHeaderBodyString")
      Future.successful(
        new Response.Builder()
          .request(req)
          .protocol(Protocol.HTTP_1_1)
          .code(200)
          .message("msg")
          .body(new okhttp3.ResponseBody() {
            val bodyString = stripeResponse.getBytes("UTF-8")
            override def contentType(): MediaType = MediaType.parse("application/json")

            override def contentLength(): Long = bodyString.length

            override def source(): BufferedSource = {
              val buf = new Buffer()
              buf.write(bodyString)
              buf
            }
          })
          .build(),
      )
    }

    val result = Handler.lambdaBody(
      StripeIntentEnv(Stages.DEV, publicKeyToPrivateKey, httpOp),
      RequestBody("pub"),
    )

    result.map { resp =>
      (requests, resp) should be(
        (
          List(("Bearer priv", "usage=off_session")),
          ApiGatewayResponse(200, ResponseBody("theSecret"), Stages.DEV),
        ),
      )
    }
  }

}
