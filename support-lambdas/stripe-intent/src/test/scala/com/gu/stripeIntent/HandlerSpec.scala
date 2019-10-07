package com.gu.stripeIntent

import java.nio.charset.Charset

import com.gu.handler.{ApiGatewayResponse, Ok}
import okhttp3.{MediaType, Protocol, Request, Response}
import okio.{Buffer, BufferedSource}
import org.scalatest.{AsyncFlatSpec, Matchers}
import scala.collection.JavaConverters._
import scala.concurrent.Future

class HandlerSpec extends AsyncFlatSpec with Matchers {


  it should "work" in {

    val publicKeyToPrivateKey = Map(StripePublicKey("pub") -> StripePrivateKey("priv"))
    val stripeResponse = """{"client_secret": "theSecret", "id": "theID"}"""

    var requests: List[(String, String)] = Nil
    val httpOp = {
      req: Request =>
        val reqBuf = new Buffer()
        req.body().writeTo(reqBuf)
        val authHeaderBodyString = (req.headers("Authorization").asScala.mkString(","), reqBuf.readString(Charset.forName("UTF-8")))
        requests =  authHeaderBodyString :: requests // !
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
            .build()
        )
    }

    val result = Handler.lambdaBody(
      StripeIntentEnv(publicKeyToPrivateKey, httpOp),
      RequestBody("pub")
    )

    result.map{ resp =>
      (requests, resp) should be((List(("Bearer priv","usage=off_session")), ApiGatewayResponse(Ok, ResponseBody("theSecret"))))
    }
  }

}
