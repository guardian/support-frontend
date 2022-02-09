package com.gu.support.workers.errors

import okhttp3.mockwebserver.{MockResponse, MockWebServer}

trait MockWebServerCreator {
  protected def createMockServer(responseCode: Int, body: String, contentType: String = "application/json") = {
    // Create a MockWebServer. These are lean enough that you can create a new
    // instance for every unit test.
    val server = new MockWebServer
    // Add the response which you want to serve
    server.enqueue(
      new MockResponse().setResponseCode(responseCode).setBody(body).setHeader("Content-type", contentType),
    )
    server.start()
    server
  }

}
