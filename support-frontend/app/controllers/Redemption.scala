package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import com.gu.monitoring.SafeLogger
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents}
import ActionBuilder._
import services.{IdentityService, MembersDataService}
import SafeLogger._
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.identity.model.User
import cats.implicits._
import play.twirl.api.Html
import views.EmptyDiv
import views.ViewHelpers.outputJson
import views.html.helper.CSRF
import views.html.main

import scala.concurrent.{ExecutionContext, Future}

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

  def displayForm() = NoCacheAction() {
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
