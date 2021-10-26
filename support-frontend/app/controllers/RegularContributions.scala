package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.OptionalAuthRequest
import admin.settings.{AllSettingsProvider, SettingsSurrogateKeySyntax}
import assets.AssetsResolver
import cats.data.EitherT
import cats.implicits._
import com.gu.i18n.Title
import com.gu.identity.model.{User => IdUser}
import com.gu.support.config.{PayPalConfigProvider, StripeConfigProvider}
import com.gu.support.workers.{Address, BillingPeriod, User}
import config.Configuration.GuardianDomain
import cookies.RecurringContributionCookies
import io.circe.syntax._
import lib.PlayImplicits._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services._

import scala.concurrent.{ExecutionContext, Future}

class RegularContributions(
    client: SupportWorkersClient,
    val assets: AssetsResolver,
    actionRefiners: CustomActionBuilders,
    identityService: IdentityService,
    testUsers: TestUserService,
    components: ControllerComponents,
    guardianDomain: GuardianDomain
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def create: EssentialAction =
    alarmOnFailure(maybeAuthenticatedAction().async(new LoggingCirceParser(components).requestParser) {
      implicit request =>
        request.user match {
          case Some(user) =>
            SafeLogger.info(s"User ${user.minimalUser.id} is attempting to create a new ${request.body.product.describe} [${request.uuid}]")
            handleCreateSupportWorkersRequest(user.minimalUser)
          case None =>
            SafeLogger.info(s"Guest user ${request.body.email} is attempting to create a new ${request.body.product.describe} [${request.uuid}]")
            createGuestUserAndHandleRequest().getOrElse(InternalServerError)
        }
    })

  private def createGuestUserAndHandleRequest()(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]): EitherT[Future, String, Result] =
    for {
      userId <- identityService.getOrCreateUserIdFromEmail(request.body.email, request.body.firstName, request.body.lastName)
      result <- EitherT.right[String](
        handleCreateSupportWorkersRequest(IdMinimalUser(userId, None))
      )
    } yield result

  private def handleCreateSupportWorkersRequest(idMinimalUser: IdMinimalUser)(
    implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]
  ): Future[Result] = {
    val result = for {
      user <- identityService.getUser(idMinimalUser)
      isTestUser = testUsers.isTestUser(request)
      statusResponse <- client.createSubscription(request, buildUser(user, request.body, isTestUser), request.uuid)
    } yield statusResponse
    respondToClient(result, request.body.product.billingPeriod)
  }

  private def respondToClient(
    result: EitherT[Future, String, StatusResponse],
    billingPeriod: BillingPeriod
  )(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]): Future[Result] = {
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new ${request.body.product.describe}, due to $error")
        // This means we do not return the guest account registration token, meaning that the client won't be able to
        // use it to create a password for this identity id.
        InternalServerError
      },
      { statusResponse =>
        SafeLogger.info(s"[${request.uuid}] Successfully created a support workers execution for a new ${request.body.product.describe}")
        Accepted(statusResponse.asJson).withCookies(RecurringContributionCookies.create(guardianDomain, billingPeriod):_*)
      }
    )
  }

  private def billingAddress(request: CreateSupportWorkersRequest): Address = {
    //contributions only ever collects country and optional state
    Address(
      lineOne = None,
      lineTwo = None,
      city = None,
      state = request.billingAddress.state,
      postCode = None,
      country = request.billingAddress.country
    )
  }

  private def buildUser(user: IdUser, request: CreateSupportWorkersRequest, isTestUser: Boolean) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      title = request.title,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = billingAddress(request),
      deliveryAddress = None,
      allowMembershipMail = false,
      // Previously the values for the fields allowThirdPartyMail and allowGURelatedMail
      // were derived by looking for the fields: statusFields.receive3rdPartyMarketing and
      // statusFields.receiveGnmMarketing in the JSON object that models a user.
      // However, a query of the identity database indicates that these fields aren't defined for any users
      // (nor are they included in the StatusFields class in identity-model).
      // Therefore, setting them statically to false is not a regression.
      // TODO: in a subsequent PR set these values based on the respective user.
      allowThirdPartyMail = false,
      allowGURelatedMail = false,
      isTestUser = isTestUser
    )
  }

}
