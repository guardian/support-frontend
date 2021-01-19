package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.{Context, RequestStreamHandler}

import java.io.{InputStream, OutputStream}

class ZuoraQuerierLambda extends RequestStreamHandler{

  def handleRequest(input: InputStream, output: OutputStream, context: Context): Unit = {

  }

}
