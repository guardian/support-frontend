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
import com.gu.support.workers.{Address, User}
import com.gu.tip.Tip
import config.Configuration.GuardianDomain
import cookies.RecurringContributionCookie
import io.circe.syntax._
import lib.PlayImplicits._
import monitoring.PathVerification._
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
    membersDataService: MembersDataService,
    identityService: IdentityService,
    testUsers: TestUserService,
    stripeConfigProvider: StripeConfigProvider,
    payPalConfigProvider: PayPalConfigProvider,
    components: ControllerComponents,
    guardianDomain: GuardianDomain,
    settingsProvider: AllSettingsProvider,
    tipMonitoring: Tip
)(implicit val exec: ExecutionContext) extends AbstractController(components) with Circe with SettingsSurrogateKeySyntax {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def create: Action[CreateSupportWorkersRequest] = maybeAuthenticatedAction().async(circe.json[CreateSupportWorkersRequest]) {
    implicit request =>
      request.user.fold {
        createContributorAndUser()
      } { fullUser =>
        createContributorWithUser(fullUser)
      }
  }

  private def createContributorWithUser(fullUser: AuthenticatedIdUser)(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]) = {
    val billingPeriod = request.body.product.billingPeriod
    SafeLogger.info(s"[${request.uuid}] User ${fullUser.minimalUser.id} is attempting to create a new $billingPeriod contribution")
    val result = for {
      user <- identityService.getUser(fullUser.minimalUser)
      statusResponse <- client.createSubscription(request, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield statusResponse
    respondToClient(result, request.body, guestCheckout = false)
  }

  private def createContributorAndUser()(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]) = {
    val billingPeriod = request.body.product.billingPeriod
    SafeLogger.info(s"[${request.uuid}] Guest user: ${request.body.email} is attempting to create a new $billingPeriod contribution")
    val result = for {
      userIdWithOptionalToken <- identityService.getOrCreateUserIdFromEmail(request.body.email, request.body.firstName, request.body.lastName)
      user <- identityService.getUser(IdMinimalUser(userIdWithOptionalToken.userId, None))
      initialStatusResponse <- client.createSubscription(request, contributor(user, request.body), request.uuid).leftMap(_.toString)
    } yield StatusResponse.fromStatusResponseAndToken(initialStatusResponse, userIdWithOptionalToken.guestAccountRegistrationToken)
    respondToClient(result, request.body, guestCheckout = true)
  }

  private def respondToClient(
    result: EitherT[Future, String, StatusResponse],
    body: CreateSupportWorkersRequest,
    guestCheckout: Boolean
  )(implicit request: OptionalAuthRequest[CreateSupportWorkersRequest]): Future[Result] = {
    val billingPeriod = body.product.billingPeriod
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new $billingPeriod contribution, due to $error")
        // This means we do not return the guest account registration token, meaning that the client won't be able to
        // use it to create a password for this identity id.
        InternalServerError
      },
      { statusResponse =>
        if (!testUsers.isTestUser(request) && body.paymentFields.isDefined) {
          monitoredRegion(body.billingAddress.country).map { region =>
            val tipPath = TipPath(region, RecurringContribution, monitoredPaymentMethod(body.paymentFields.get), guestCheckout)
            verify(tipPath, tipMonitoring.verify)
          }
        }
        Accepted(statusResponse.asJson).withCookies(RecurringContributionCookie.create(guardianDomain, billingPeriod))
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

  private def contributor(user: IdUser, request: CreateSupportWorkersRequest) = {
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
      isTestUser = testUsers.isTestUser(user.publicFields.username)
    )
  }

}
