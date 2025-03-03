package services

import admin.settings.{LandingPageCopy, LandingPageTest, LandingPageVariant, RegionTargeting, Status, Products}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters.MapHasAsJava

class LandingPageTestServiceSpec extends AsyncFlatSpec with Matchers {
  "LandingPageTestService" should "parseLandingPageTest" in {
    val dynamoTest = Map(
      "channel" -> AttributeValue.builder().s("SupportLandingPage").build(),
      "name" -> AttributeValue.builder().s("test1").build(),
      "priority" -> AttributeValue.builder().n(3.toString).build(),
      "status" -> AttributeValue.builder().s("Live").build(),
      "regionTargeting" -> AttributeValue
        .builder()
        .m(
          Map(
            "targetedCountryGroups" -> AttributeValue
              .builder()
              .l(
                AttributeValue.builder().s("GBPCountries").build(),
              )
              .build(),
          ).asJava,
        )
        .build(),
      "variants" -> AttributeValue
        .builder()
        .l(
          AttributeValue
            .builder()
            .m(
              Map(
                "name" -> AttributeValue.builder().s("control").build(),
                "copy" -> AttributeValue
                  .builder()
                  .m(
                    Map(
                      "heading" -> AttributeValue.builder().s("test heading").build(),
                      "subheading" -> AttributeValue.builder().s("test subheading").build(),
                    ).asJava,
                  )
                  .build(),
                "products" -> AttributeValue
                  .builder()
                  .m(
                    Map(
                      "Contribution" -> AttributeValue
                        .builder()
                        .m(
                          Map(
                            "title" -> AttributeValue.builder().s("Support").build(),
                            "benefits" -> AttributeValue
                              .builder()
                              .l(
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue
                                        .builder()
                                        .s("Give to the Guardian every month with Support")
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                              )
                              .build(),
                            "cta" -> AttributeValue
                              .builder()
                              .m(
                                Map(
                                  "copy" -> AttributeValue.builder().s("Support").build(),
                                ).asJava,
                              )
                              .build(),
                          ).asJava,
                        )
                        .build(),
                      "SupporterPlus" -> AttributeValue
                        .builder()
                        .m(
                          Map(
                            "title" -> AttributeValue.builder().s("All-access digital!!").build(),
                            "benefits" -> AttributeValue
                              .builder()
                              .l(
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue
                                        .builder()
                                        .s("Unlimited access to the Guardian app")
                                        .build(),
                                      "tooltip" -> AttributeValue
                                        .builder()
                                        .s(
                                          "Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.",
                                        )
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue
                                        .builder()
                                        .s("Ad-free reading on all your devices")
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue
                                        .builder()
                                        .s(
                                          "Exclusive newsletter for supporters, sent every week from the Guardian newsroom",
                                        )
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue.builder().s("Far fewer asks for support").build(),
                                      "tooltip" -> AttributeValue
                                        .builder()
                                        .s(
                                          "You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.",
                                        )
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue
                                        .builder()
                                        .s("Unlimited access to the Guardian Feast app")
                                        .build(),
                                      "tooltip" -> AttributeValue
                                        .builder()
                                        .s(
                                          "Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.",
                                        )
                                        .build(),
                                      "label" -> AttributeValue
                                        .builder()
                                        .m(
                                          Map(
                                            "copy" -> AttributeValue.builder().s("New").build(),
                                          ).asJava,
                                        )
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                              )
                              .build(),
                            "cta" -> AttributeValue
                              .builder()
                              .m(
                                Map(
                                  "copy" -> AttributeValue.builder().s("Support").build(),
                                ).asJava,
                              )
                              .build(),
                            "label" -> AttributeValue
                              .builder()
                              .m(
                                Map(
                                  "copy" -> AttributeValue.builder().s("Recommended").build(),
                                ).asJava,
                              )
                              .build(),
                          ).asJava,
                        )
                        .build(),
                      "TierThree" -> AttributeValue
                        .builder()
                        .m(
                          Map(
                            "title" -> AttributeValue.builder().s("Digital + print").build(),
                            "benefits" -> AttributeValue
                              .builder()
                              .l(
                                AttributeValue
                                  .builder()
                                  .m(
                                    Map(
                                      "copy" -> AttributeValue
                                        .builder()
                                        .s("Guardian Weekly print magazine delivered to your door every week")
                                        .build(),
                                      "tooltip" -> AttributeValue
                                        .builder()
                                        .s(
                                          "Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.",
                                        )
                                        .build(),
                                    ).asJava,
                                  )
                                  .build(),
                              )
                              .build(),
                            "cta" -> AttributeValue
                              .builder()
                              .m(
                                Map(
                                  "copy" -> AttributeValue.builder().s("Support").build(),
                                ).asJava,
                              )
                              .build(),
                          ).asJava,
                        )
                        .build(),
                    ).asJava,
                  )
                  .build(),
              ).asJava,
            )
            .build(),
        )
        .build(),
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
