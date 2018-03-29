package util

import play.api.mvc.Request
import simulacrum.typeclass
import model.RequestType
import model.paypal.PaypalHook

@typeclass trait RequestTypeDecoder[A] {
  def requestType(data: A): RequestType
}

object RequestTypeDecoder {
  object instances {
    implicit def requestTypeDecoder[A]: RequestTypeDecoder[Request[A]] = new RequestTypeDecoder[Request[A]] {
      override def requestType(data: Request[A]): RequestType = {
        if (data.getQueryString("mode").contains("test")) {
          RequestType.Test
        } else {
          RequestType.Live
        }
      }
    }
  }
  object hook {
    implicit def requestTypeDecoder: RequestTypeDecoder[PaypalHook] = new RequestTypeDecoder[PaypalHook] {
      // TODO: implement based on production mode
      override def requestType(data: PaypalHook): RequestType = RequestType.Test
    }
  }
}

// Get an instance of A for a given request type
trait RequestBasedProvider[A] {
  import RequestTypeDecoder.ops._

  def getInstanceForRequestType(requestType: RequestType): A

  def getInstanceFor[B : RequestTypeDecoder](data: B): A =
    getInstanceForRequestType(data.requestType)

}

object RequestBasedProvider {

  // TODO: make arguments type safe?
  def apply[A](test: A, live: A): RequestBasedProvider[A] =
    new DefaultImpl[A](test, live)

  private class DefaultImpl[A](test: A, live: A) extends RequestBasedProvider[A] {
    override def getInstanceForRequestType(requestType: RequestType): A =
      requestType match {
        case RequestType.Test => test
        case RequestType.Live => live
      }
  }
}
