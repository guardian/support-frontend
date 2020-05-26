package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import admin.settings.{AllSettings, AllSettingsProvider}
import akka.util.ByteString
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.implicits._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.identity.model.{User => IdUser}
import com.gu.support.catalog.Corporate
import com.gu.support.redemptions.{CorporateCustomer, CorporateRedemption}
import com.gu.support.redemptions.redemptions.RedemptionCode
import com.gu.support.workers
import com.gu.support.workers.{Address, DigitalPack, Monthly, User}
import com.sun.jndi.cosnaming.IiopUrl.Address
import controllers.RedemptionController.{blankAddress, digitalSubscription, ophanIds}
import play.api.mvc.{AbstractController, Action, AnyContent, BodyParser, ControllerComponents, Request, RequestHeader}
import play.twirl.api.Html
import services.{IdentityService, MembersDataService, TestUserService}
import views.EmptyDiv
import io.circe.syntax._
import ophan.thrift.event.AbTest
import play.api.libs.circe.Circe
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import utils.CheckoutValidationRules
import lib.PlayImplicits._
import play.api.libs.streams.Accumulator
import play.api.libs.ws.{WSRequest, WSResponse}

import scala.concurrent.{ExecutionContext, Future}

class RedemptionController(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  membersDataService: MembersDataService,
  testUsers: TestUserService,
  client: SupportWorkersClient,
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent],
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) with Circe {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def getCorporateCustomer(redemptionCode: RedemptionCode): Either[String, CorporateCustomer] =
    if (redemptionCode == "test-code")
      Right(CorporateCustomer("1", "Test Company", "test-code"))
    else
      Left("This code is not valid")

  def displayForm(redemptionCode: String) = NoCacheAction() {
    implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      val title = "Support the Guardian | Redeem your code"
      val id = EmptyDiv("subscriptions-redemption-page")
      val js = "subscriptionsRedemptionPage.js"
      val css = "digitalSubscriptionCheckoutPage.css" //TODO: Don't need this?
      val customerOrError = getCorporateCustomer(redemptionCode)
      val jsCustomer = customerOrError.map(customer => s"""window.guardian.corporateCustomer = ${customer.asJson};""").getOrElse("")
      val jsError = customerOrError.left.map(error => s"""window.guardian.error = "${error}";""").swap.getOrElse("")

      Ok(views.html.main(
        title,
        id,
        Left(RefPath(js)),
        Left(RefPath(css)),
        fontLoaderBundle
      ) {
        Html(
          s"""
          <script type="text/javascript">
              window.guardian.userCode = "${redemptionCode}";
              ${jsError}
              ${jsCustomer}
          </script>
    """)
      })

  }

  def bodyParser(redemptionCode: RedemptionCode): BodyParser[CreateSupportWorkersRequest] =
    BodyParser {
      request =>
        Accumulator.source[ByteString].mapFuture(_ => parseRequest(redemptionCode, request))
    }

  def parseRequest(redemptionCode: RedemptionCode, request: RequestHeader) =
    Future.successful( //TODO: move the identity call in here
      getCorporateCustomer(redemptionCode).map(
        corporateCustomer =>
          CreateSupportWorkersRequest(
            None,
            "",
            "", blankAddress, None, None, None, None, None,
            digitalSubscription(),
            None,
            Right(CorporateRedemption(redemptionCode, corporateCustomer.accountId)), None,
            ophanIds(request), RedemptionController.referrerAcquisitionData, Set.empty[AbTest],
            "dummyemail",
            None, None, None
          )
      ).toOption.toRight(BadRequest("Error creating a CreateSupportWorkersRequest")))

  def create(redemptionCode: String) =
    authenticatedAction(subscriptionsClientId).async( bodyParser(redemptionCode)) {
      implicit request: AuthRequest[CreateSupportWorkersRequest] =>
        val userOrError = identityService.getUser(request.user.minimalUser)
        userOrError.fold(
          BadRequest(_),
          user => createSub(request, user)
        )
    }

  def createSub(request: AuthRequest[CreateSupportWorkersRequest], user: IdUser) = {
    client.createSubscription(
      request,
      RedemptionController.createUser(user, request.body, testUsers), request.uuid
    )
    Ok("test")
  }

  def validateCode(redemptionCode: String) = CachedAction(){
    getCorporateCustomer(redemptionCode).fold(
      errorString => Ok(errorString),
      customer => Ok(customer.asJson)
    )
  }
}


object RedemptionController {
  val blankAddress = workers.Address(None, None, None, None, None, Country.UK) //TODO: country
  def digitalSubscription() = DigitalPack(GBP, Monthly, Corporate) //TODO: currency
  def ophanIds(request: RequestHeader): OphanIds = {
    new OphanIds(
      None, // TODO: pageview id
      request.cookies.get("vsid").map(_.value),
      request.cookies.get("bwid").map(_.value)
    )
  }

  def referrerAcquisitionData = new ReferrerAcquisitionData(
    None, None, None, None, None, None, None, None, None, None, None, None //TODO: what do we need out of this?
  )

  def createUser(user: IdUser, request: CreateSupportWorkersRequest, testUsers: TestUserService) = {
    User(
      id = user.id,
      primaryEmailAddress = user.primaryEmailAddress,
      title = request.title,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = request.billingAddress,
      deliveryAddress = request.deliveryAddress,
      telephoneNumber = request.telephoneNumber,
      isTestUser = testUsers.isTestUser(user.publicFields.displayName),
      deliveryInstructions = request.deliveryInstructions
    )
  }
}
