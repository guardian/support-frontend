package services

import admin.settings.{ABTest, EpsilonGreedyBandit, LandingPageTest, LandingPageVariant, Methodology, Roulette}
import com.typesafe.scalalogging.StrictLogging

import scala.util.Random

/** Service for selecting landing page variants based on test methodologies.
  *
  * Implements ABTest (random), EpsilonGreedy, and Roulette selection algorithms.
  */
object VariantSelection extends StrictLogging {

  /** Main entry point for variant selection.
    *
    * @param test
    *   The landing page test configuration
    * @param mvtId
    *   The user's MVT ID for deterministic random selection
    * @param banditData
    *   Performance data for bandit tests
    * @return
    *   The selected variant
    */
  def selectVariant(
      test: LandingPageTest,
      mvtId: Int,
      banditData: List[BanditData],
  ): LandingPageVariant = {
    val methodologies = test.methodologies.getOrElse(Methodology.defaultMethodologies)

    // Pick methodology (if multiple, use mvtId to select one deterministically)
    val methodology = pickMethodology(methodologies, mvtId, test.name)

    // Get test name with methodology override if specified
    val effectiveTestName = methodology.testName.getOrElse(test.name)

    // Select variant based on methodology
    methodology match {
      case _: ABTest =>
        selectVariantUsingMVT(test, mvtId)

      case eg: EpsilonGreedyBandit =>
        val testBanditData = banditData.find(_.testName == effectiveTestName)
        selectVariantUsingEpsilonGreedy(test, eg.epsilon, testBanditData, mvtId)

      case _: Roulette =>
        val testBanditData = banditData.find(_.testName == effectiveTestName)
        selectVariantUsingRoulette(test, testBanditData, mvtId)
    }
  }

  /** Pick a methodology from the list.
    *
    * If there's only one, use it. If multiple, use mvtId to deterministically select one.
    */
  private def pickMethodology(
      methodologies: List[Methodology],
      mvtId: Int,
      testName: String,
  ): Methodology = {
    if (methodologies.length == 1) {
      methodologies.head
    } else {
      val index = getRandomNumber(testName, mvtId) % methodologies.length
      methodologies(index)
    }
  }

  /** Standard AB test variant selection using MVT ID.
    *
    * Uses deterministic random number generation based on test name and mvtId.
    */
  def selectVariantUsingMVT(test: LandingPageTest, mvtId: Int): LandingPageVariant = {
    if (test.variants.isEmpty) {
      throw new IllegalArgumentException(s"Test ${test.name} has no variants")
    }

    val randomNumber = getRandomNumber(test.name, mvtId)
    val index = randomNumber % test.variants.length
    test.variants(index)
  }

  /** Epsilon-greedy bandit selection.
    *
    * With probability epsilon, select a random variant (explore). With probability 1-epsilon, select the best
    * performing variant (exploit).
    */
  def selectVariantUsingEpsilonGreedy(
      test: LandingPageTest,
      epsilon: Double,
      testBanditData: Option[BanditData],
      mvtId: Int,
  ): LandingPageVariant = {
    // If no bandit data or insufficient samples, fall back to random selection
    testBanditData match {
      case None =>
        logger.warn(s"No bandit data found for test ${test.name}, falling back to random selection")
        return selectVariantUsingMVT(test, mvtId)

      case Some(data) if data.sortedVariants.isEmpty =>
        logger.warn(s"Empty bandit data for test ${test.name}, falling back to random selection")
        return selectVariantUsingMVT(test, mvtId)

      case Some(data) =>
        // Check if all variants have zero mean (indicates insufficient samples)
        val allZeroMeans = data.sortedVariants.forall(_.mean == 0.0)
        if (allZeroMeans) {
          logger.info(
            s"Insufficient hourly samples for test ${test.name} (all means are zero), falling back to random selection",
          )
          return selectVariantUsingMVT(test, mvtId)
        }

        // Epsilon-greedy logic: explore with probability epsilon (deterministic based on mvtId)
        val randomValue = (getRandomNumber(test.name + "-epsilon", mvtId) % 100) / 100.0
        if (epsilon > randomValue) {
          // Explore: select random variant (deterministic)
          selectVariantUsingMVT(test, mvtId)
        } else {
          // Exploit: select best variant
          val validVariants = filterValidVariants(data.sortedVariants, test)
          if (validVariants.isEmpty) {
            logger.warn(s"No valid variants in bandit data for test ${test.name}, falling back to random selection")
            return selectVariantUsingMVT(test, mvtId)
          }

          // sortedVariants is already sorted by mean descending, so first is best
          val bestVariantName = validVariants.head.variantName
          test.variants
            .find(_.name == bestVariantName)
            .getOrElse {
              logger.error(
                s"Best variant $bestVariantName not found in test ${test.name} variants, falling back to random",
              )
              selectVariantUsingMVT(test, mvtId)
            }
        }
    }
  }

  /** Roulette (weighted random) bandit selection.
    *
    * Select variants probabilistically based on their mean performance, with a minimum weight to avoid zero
    * probability.
    */
  def selectVariantUsingRoulette(
      test: LandingPageTest,
      testBanditData: Option[BanditData],
      mvtId: Int,
  ): LandingPageVariant = {
    // If no bandit data, fall back to random selection
    testBanditData match {
      case None =>
        logger.warn(s"No bandit data found for test ${test.name}, falling back to random selection")
        return selectVariantUsingMVT(test, mvtId)

      case Some(data) if data.sortedVariants.isEmpty =>
        logger.warn(s"Empty bandit data for test ${test.name}, falling back to random selection")
        return selectVariantUsingMVT(test, mvtId)

      case Some(data) =>
        // Check if all variants have zero mean (indicates insufficient samples)
        val allZeroMeans = data.sortedVariants.forall(_.mean == 0.0)
        if (allZeroMeans) {
          logger.info(
            s"Insufficient hourly samples for test ${test.name} (all means are zero), falling back to random selection",
          )
          return selectVariantUsingMVT(test, mvtId)
        }

        val validVariants = filterValidVariants(data.sortedVariants, test)
        if (validVariants.isEmpty) {
          logger.warn(s"No valid variants in bandit data for test ${test.name}, falling back to random selection")
          return selectVariantUsingMVT(test, mvtId)
        }

        val sumOfMeans = validVariants.map(_.mean).sum
        if (sumOfMeans <= 0) {
          logger.warn(s"Sum of means is non-positive for test ${test.name}, falling back to random selection")
          return selectVariantUsingMVT(test, mvtId)
        }

        // Apply minimum weight to avoid zero probability variants
        val minWeight = 0.1
        val variantsWithWeights = validVariants.map { vm =>
          val weight = Math.max(vm.mean / sumOfMeans, minWeight)
          (vm.variantName, weight)
        }

        // Normalize weights to sum to 1.0
        val sumOfWeights = variantsWithWeights.map(_._2).sum
        val normalizedWeights = variantsWithWeights.map { case (name, weight) =>
          (name, weight / sumOfWeights)
        }

        // Select variant using roulette wheel (deterministic based on mvtId)
        val rand = (getRandomNumber(test.name + "-roulette", mvtId) % 10000) / 10000.0
        var acc = 0.0
        val selectedVariantName = normalizedWeights
          .find { case (_, weight) =>
            acc += weight
            rand < acc
          }
          .map(_._1)
          .getOrElse {
            // Fallback to last variant if rounding errors occur
            normalizedWeights.last._1
          }

        test.variants
          .find(_.name == selectedVariantName)
          .getOrElse {
            logger.error(
              s"Selected variant $selectedVariantName not found in test ${test.name} variants, falling back to random",
            )
            selectVariantUsingMVT(test, mvtId)
          }
    }
  }

  /** Select a random variant using non-deterministic randomness.
    *
    * NOTE: This method exists for reference to SDC's implementation, which uses Math.random(). Our implementation uses
    * selectVariantUsingMVT instead for deterministic selection based on MVT ID, ensuring consistent user experience.
    * This is a deliberate improvement over SDC's approach.
    *
    * @deprecated
    *   Use selectVariantUsingMVT for deterministic selection
    */
  @deprecated("Use selectVariantUsingMVT for deterministic selection", "1.0")
  private def selectRandomVariant(test: LandingPageTest): LandingPageVariant = {
    if (test.variants.isEmpty) {
      throw new IllegalArgumentException(s"Test ${test.name} has no variants")
    }
    val index = Random.nextInt(test.variants.length)
    test.variants(index)
  }

  /** Filter bandit data variants to only include those that exist in the test configuration. */
  private def filterValidVariants(
      sortedVariants: List[VariantMean],
      test: LandingPageTest,
  ): List[VariantMean] = {
    val testVariantNames = test.variants.map(_.name).toSet
    sortedVariants.filter(vm => testVariantNames.contains(vm.variantName))
  }

  /** Generate a deterministic random number based on seed and mvtId.
    *
    * Mimics the behavior of support-dotcom-components' getRandomNumber function.
    */
  private def getRandomNumber(seed: String, mvtId: Int): Int = {
    val combined = seed + mvtId.toString
    val hash = combined.hashCode
    Math.abs(hash)
  }
}
