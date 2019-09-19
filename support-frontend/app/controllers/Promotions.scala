package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.promotions.PromotionServiceProvider
import play.api.mvc.{AbstractController, ControllerComponents}
import play.twirl.api.Html
import services.TestUserService
import views.EmptyDiv
import views.ViewHelpers.outputJson

class Promotions(
  promotionServerProvider: PromotionServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  testUsers: TestUserService,  //Remove?
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent],
  settingsProvider: AllSettingsProvider,
) extends AbstractController(components){
  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def terms(promoCode: String) = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Digital Pack Subscription"
    val mainElement = EmptyDiv("promotion-terms")
    val js = Left(RefPath("promotionTerms.js"))
    val css = Left(RefPath("promotionTerms.css"))
    val promotionService = promotionServerProvider.forUser(false)
    val maybePromotion = promotionService.findPromotion(promoCode)

    Ok(views.html.main(
      title, mainElement, js, css, fontLoaderBundle
    ){
      Html(s"""<script type="text/javascript">window.guardian.promotion = ${maybePromotion.map(outputJson(_))}</script>""")
    })
  }


}
