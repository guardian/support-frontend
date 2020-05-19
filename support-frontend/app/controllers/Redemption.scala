package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.identity.model.User
import play.api.mvc.{AbstractController, ControllerComponents}
import play.twirl.api.Html
import services.{IdentityService, MembersDataService}
import views.EmptyDiv

import scala.concurrent.ExecutionContext

class Redemption(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  membersDataService: MembersDataService,
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent],
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  //def getRedemptionData(redemptionCode: RedemptionCode): Option[CorporateRedemption] =

  def displayForm(redemptionCode: String) = NoCacheAction() {
    implicit request =>
      implicit val settings: AllSettings = settingsProvider.getAllSettings()
      val title = "Support the Guardian | Redeem your code"
      val id = EmptyDiv("subscriptions-redemption-page")
      val js = "subscriptionsRedemptionPage.js"
      val css = "digitalSubscriptionCheckoutPage.css" //TODO: Don't need this?

      Ok(views.html.main(
        title,
        id,
        Left(RefPath(js)),
        Left(RefPath(css)),
        fontLoaderBundle
      ) {
        Html(s"""<script type="text/javascript">window.guardian.productPrices = ""</script>""")
      })
  }

//  def create: Action[CreateSupportWorkersRequest] =
//    authenticatedAction(recurringIdentityClientId).async(circe.json[CreateSupportWorkersRequest]) {
//      implicit request: AuthRequest[CreateSupportWorkersRequest] =>
//        handleCreateSupportWorkersRequest(request, CheckoutValidationRules.validatorFor(request.body.product))
//    }

//  def redeemCode() = NoCacheAction() {
//    implicit request =>
//
//  }

//  def processRedemption(): Action[AnyContent] =
//    authenticatedAction(subscriptionsClientId).async { implicit request =>
//      identityService.getUser(request.user.minimalUser).fold(
//        error => {
//          SafeLogger.error(scrub"Failed to display digital subscriptions form for ${request.user.minimalUser.id} due to error from identityService: $error")
//          Future.successful(InternalServerError)
//        },
//        user => {
//          userHasDigipack(membersDataService, request.user) map {
//            case true => Redirect(routes.DigitalSubscription.displayThankYouExisting().url, request.queryString, status = FOUND)
//            case _ => Ok(redemptionForm(user))
//          }
//        }
//      ).flatten
//    }

  def redemptionForm(user: User) = {
    "hi"
  }
}
