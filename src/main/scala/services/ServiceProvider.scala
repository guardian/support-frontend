package services

import model.RequestType

trait ServiceProvider[Service] {
  def getService(requestType: RequestType): Service
}

object ServiceProvider {

  private class DefaultImpl[Service] (test: Service, live: Service) extends ServiceProvider[Service] {
    override def getService(requestType: RequestType): Service =
      requestType match {
        case RequestType.Test => test
        case RequestType.Live => live
      }
  }

  def apply[Service](test: Service, live: Service): ServiceProvider[Service] =
    new DefaultImpl(test, live)
}