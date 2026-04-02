package controllers

import admin.settings.{LandingPageTest, LandingPageVariant, Status}
import com.typesafe.scalalogging.StrictLogging
import play.api.mvc.{Cookie, RequestHeader}
import services.{BanditDataService, LandingPageTestService, VariantSelection}

import scala.util.Try

/** Helper for selecting landing page variants based on test methodologies.
  *
  * This can be used in controllers to perform server-side variant selection before rendering pages.
  */
class LandingPageVariantSelector(
    landingPageTestService: LandingPageTestService,
    banditDataService: BanditDataService,
) extends StrictLogging {

  /** Get the user's MVT ID from cookies.
    *
    * Falls back to 0 if cookie is missing or invalid.
    */
  private def getMvtId(request: RequestHeader): Int = {
    request.cookies
      .get("GU_mvt_id")
      .flatMap(c => Try(c.value.toInt).toOption)
      .getOrElse(0)
  }

  /** Check if a variant is forced via URL parameter.
    *
    * Format: ?force-landing-page=TEST_NAME:VARIANT_NAME
    */
  private def getForcedVariant(request: RequestHeader, testName: String): Option[String] = {
    request.getQueryString("force-landing-page").flatMap { param =>
      param.split(":") match {
        case Array(forcedTestName, variantName) if forcedTestName == testName =>
          Some(variantName)
        case _ => None
      }
    }
  }

  /** Select a variant for a specific test.
    *
    * @param test
    *   The landing page test configuration
    * @param request
    *   The HTTP request (used to get MVT ID and check for forced variants)
    * @return
    *   The selected variant, or None if test has no variants
    */
  def selectVariantForTest(
      test: LandingPageTest,
      request: RequestHeader,
  ): Option[LandingPageVariant] = {
    if (test.variants.isEmpty) {
      logger.warn(s"Test ${test.name} has no variants")
      return None
    }

    // Check for forced variant first
    getForcedVariant(request, test.name) match {
      case Some(forcedVariantName) =>
        val forcedVariant = test.variants.find(_.name == forcedVariantName)
        if (forcedVariant.isEmpty) {
          logger.warn(s"Forced variant $forcedVariantName not found in test ${test.name}")
        }
        return forcedVariant

      case None =>
        // No forced variant, proceed with normal selection
        val mvtId = getMvtId(request)
        val banditData = banditDataService.getBanditData()

        try {
          Some(VariantSelection.selectVariant(test, mvtId, banditData))
        } catch {
          case e: Exception =>
            logger.error(s"Error selecting variant for test ${test.name}: ${e.getMessage}", e)
            // Fallback to first variant
            test.variants.headOption
        }
    }
  }

  /** Select variants for all live landing page tests.
    *
    * @param request
    *   The HTTP request
    * @return
    *   Map of test name to selected variant
    */
  def selectVariantsForAllTests(request: RequestHeader): Map[String, LandingPageVariant] = {
    val liveTests = landingPageTestService
      .getTests()
      .filter(_.status == Status.Live)

    liveTests.flatMap { test =>
      selectVariantForTest(test, request).map(variant => test.name -> variant)
    }.toMap
  }

  /** Get the selected variant for a specific test by name.
    *
    * @param testName
    *   The name of the test
    * @param request
    *   The HTTP request
    * @return
    *   The selected variant, or None if test not found or has no variants
    */
  def getVariantForTest(testName: String, request: RequestHeader): Option[LandingPageVariant] = {
    landingPageTestService
      .getTests()
      .find(test => test.name == testName && test.status == Status.Live)
      .flatMap(test => selectVariantForTest(test, request))
  }
}

object LandingPageVariantSelector {

  /** Create a LandingPageVariantSelector instance.
    *
    * This is typically called from dependency injection in controllers.
    */
  def apply(
      landingPageTestService: LandingPageTestService,
      banditDataService: BanditDataService,
  ): LandingPageVariantSelector =
    new LandingPageVariantSelector(landingPageTestService, banditDataService)
}
