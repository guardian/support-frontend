package services

import admin.settings.{LandingPageCopy, LandingPageTest, LandingPageVariant, RegionTargeting, Status, Products}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters.{SeqHasAsJava, MapHasAsJava}

class LandingPageTestServiceSpec extends AsyncFlatSpec with Matchers {

  private def stringAttr(value: String): AttributeValue = AttributeValue.builder().s(value).build()
  private def numberAttr(value: Int): AttributeValue = AttributeValue.builder().n(value.toString).build()
  private def mapAttr(value: Map[String, AttributeValue]): AttributeValue =
    AttributeValue.builder().m(value.asJava).build()
  private def listAttr(value: List[AttributeValue]): AttributeValue = AttributeValue.builder().l(value.asJava).build()

  "LandingPageTestService" should "parseLandingPageTest" in {
    val dynamoTest = Map(
      "channel" -> stringAttr("SupportLandingPage"),
      "name" -> stringAttr("test1"),
      "priority" -> numberAttr(3),
      "status" -> stringAttr("Live"),
      "regionTargeting" -> mapAttr(
        Map(
          "targetedCountryGroups" -> listAttr(List(stringAttr("GBPCountries"))),
        ),
      ),
      "variants" -> listAttr(
        List(
          mapAttr(
            Map(
              "name" -> stringAttr("control"),
              "copy" -> mapAttr(
                Map(
                  "heading" -> stringAttr("test heading"),
                  "subheading" -> stringAttr("test subheading"),
                ),
              ),
              "products" -> mapAttr(
                Map(
                  "Contribution" -> mapAttr(
                    Map(
                      "title" -> stringAttr("Support"),
                      "benefits" -> listAttr(
                        List(
                          mapAttr(
                            Map("copy" -> stringAttr("Give to the Guardian every month with Support")),
                          ),
                        ),
                      ),
                      "cta" -> mapAttr(Map("copy" -> stringAttr("Support"))),
                    ),
                  ),
                  "SupporterPlus" -> mapAttr(
                    Map(
                      "title" -> stringAttr("All-access digital!!"),
                      "benefits" -> listAttr(
                        List(
                          mapAttr(
                            Map(
                              "copy" -> stringAttr("Unlimited access to the Guardian app"),
                              "tooltip" -> stringAttr(
                                "Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.",
                              ),
                            ),
                          ),
                          mapAttr(Map("copy" -> stringAttr("Ad-free reading on all your devices"))),
                          mapAttr(
                            Map(
                              "copy" -> stringAttr(
                                "Exclusive newsletter for supporters, sent every week from the Guardian newsroom",
                              ),
                            ),
                          ),
                          mapAttr(
                            Map(
                              "copy" -> stringAttr("Far fewer asks for support"),
                              "tooltip" -> stringAttr(
                                "You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.",
                              ),
                            ),
                          ),
                          mapAttr(
                            Map(
                              "copy" -> stringAttr("Unlimited access to the Guardian Feast app"),
                              "tooltip" -> stringAttr(
                                "Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.",
                              ),
                              "label" -> mapAttr(Map("copy" -> stringAttr("New"))),
                            ),
                          ),
                        ),
                      ),
                      "cta" -> mapAttr(Map("copy" -> stringAttr("Support"))),
                      "label" -> mapAttr(Map("copy" -> stringAttr("Recommended"))),
                    ),
                  ),
                  "TierThree" -> mapAttr(
                    Map(
                      "title" -> stringAttr("Digital + print"),
                      "benefits" -> listAttr(
                        List(
                          mapAttr(
                            Map(
                              "copy" -> stringAttr("Guardian Weekly print magazine delivered to your door every week"),
                              "tooltip" -> stringAttr(
                                "Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.",
                              ),
                            ),
                          ),
                        ),
                      ),
                      "cta" -> mapAttr(Map("copy" -> stringAttr("Support"))),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    )

    val result = LandingPageTestService.parseLandingPageTest(dynamoTest.asJava)
    result shouldBe Right(
      LandingPageTest(
        name = "test1",
        priority = 3,
        status = Status.Live,
        regionTargeting = Some(
          RegionTargeting(
            targetedCountryGroups = List("GBPCountries"),
          ),
        ),
        variants = List(
          LandingPageVariant(
            name = "control",
            copy = LandingPageCopy(
              heading = "test heading",
              subheading = "test subheading",
            ),
            products = Some(Products.defaultProducts),
          ),
        ),
      ),
    )
  }
}
