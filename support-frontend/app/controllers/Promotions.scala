package controllers

import actions.CustomActionBuilders
import admin.settings.{AllSettings, AllSettingsProvider}
import assets.{AssetsResolver, RefPath, StyleContent}
import com.gu.support.config.Stage
import com.gu.support.promotions.{PromotionServiceProvider, PromotionTerms}
import play.api.mvc.{AbstractController, ControllerComponents}
import play.twirl.api.Html
import services.TestUserService
import views.EmptyDiv
import views.ViewHelpers.outputJson

class Promotions(
  promotionServiceProvider: PromotionServiceProvider,
  val assets: AssetsResolver,
  val actionRefiners: CustomActionBuilders,
  testUsers: TestUserService,  //Remove?
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent],
  settingsProvider: AllSettingsProvider,
  stage: Stage
) extends AbstractController(components){
  import actionRefiners._

  implicit val a: AssetsResolver = assets

  def terms(promoCode: String) = CachedAction() { implicit request =>
    implicit val settings: AllSettings = settingsProvider.getAllSettings()
    val title = "Support the Guardian | Digital Pack Subscription"
    val mainElement = EmptyDiv("promotion-terms")
    val js = Left(RefPath("promotionTerms.js"))
    val css = Left(RefPath("promotionTerms.css"))
    val promotionService = promotionServiceProvider.forUser(false)
    val maybePromotionTerms = PromotionTerms.fromPromoCode(promotionService, stage, promoCode)

    Ok(views.html.main(
      title, mainElement, js, css, fontLoaderBundle
    ){
      Html(
        s"""<script type="text/javascript">
              window.guardian.promotionTerms = ${outputJson(maybePromotionTerms)}
            </script>""")
    })
  }


}
