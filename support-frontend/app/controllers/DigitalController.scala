package controllers

import services.{AccessCredentials, AuthenticatedIdUser, MembersDataService}

import scala.concurrent.{ExecutionContext, Future}

trait DigitalController {
  protected def userHasDigipack(membersDataService: MembersDataService, user: AuthenticatedIdUser)(implicit executionContext: ExecutionContext): Future[Boolean] = {
    user.credentials match {
      case cookies: AccessCredentials.Cookies =>
        membersDataService.userAttributes(cookies).value map {
          case Left(_) => false
          case Right(response: MembersDataService.UserAttributes) => response.contentAccess.digitalPack
        }
      case _ => Future.successful(false)
    }
  }
}
