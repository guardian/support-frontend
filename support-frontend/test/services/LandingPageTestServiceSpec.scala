package services

import admin.settings.{
  CountdownSettings,
  CountdownTheme,
  Cta,
  Label,
  LandingPageCopy,
  LandingPageProductDescription,
  LandingPageTest,
  LandingPageVariant,
  ProductBenefit,
  Products,
  RegionTargeting,
  Status,
  TickerCopy,
  TickerSettings,
}
import io.circe.Decoder
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters.{MapHasAsJava, SeqHasAsJava}

class LandingPageTestServiceSpec extends AsyncFlatSpec with Matchers {

  private def parseDynamoRecord[T: Decoder](record: java.util.Map[String, AttributeValue]): Either[io.circe.Error, T] =
    DynamoJsonConverter.mapToJson(record).as[T]

  private def stringAttr(value: String): AttributeValue = AttributeValue.builder().s(value).build()
  private def booleanAttr(value: Boolean): AttributeValue = AttributeValue.builder().bool(value).build()
  private def numberAttr(value: Int): AttributeValue = AttributeValue.builder().n(value.toString).build()
  private def mapAttr(value: Map[String, AttributeValue]): AttributeValue =
    AttributeValue.builder().m(value.asJava).build()
  private def listAttr(value: List[AttributeValue]): AttributeValue = AttributeValue.builder().l(value.asJava).build()

  private val products = Products(
    Contribution = Some(
      LandingPageProductDescription(
        title = "Support",
        benefits = List(
          ProductBenefit(copy = "Give to the Guardian every month with Support"),
        ),
        cta = Cta(copy = "Support"),
      ),
    ),
    SupporterPlus = Some(
      LandingPageProductDescription(
        title = "All-access digital",
        benefits = List(
          ProductBenefit(
            copy = "Unlimited access to the Guardian app",
            tooltip = Some(
              "Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.",
            ),
          ),
          ProductBenefit(copy = "Ad-free reading on all your devices"),
          ProductBenefit(copy = "Exclusive newsletter for supporters, sent every week from the Guardian newsroom"),
          ProductBenefit(
            copy = "Far fewer asks for support",
            tooltip =
              Some("You'll see far fewer financial support asks at the bottom of articles or in pop-up banners."),
          ),
          ProductBenefit(
            copy = "Unlimited access to the Guardian Feast app",
            tooltip = Some(
              "Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.",
            ),
            label = Some(Label(copy = "New")),
          ),
        ),
        cta = Cta(copy = "Support"),
        label = Some(Label(copy = "Recommended")),
      ),
    ),
    DigitalSubscription = Some(
      LandingPageProductDescription(
        title = "Digital plus",
        benefits = List(
          ProductBenefit(
            copy = "Guardian Weekly print magazine delivered to your door every week",
            tooltip = Some(
              "Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.",
            ),
          ),
        ),
        cta = Cta(copy = "Support"),
      ),
    ),
  )

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
                      "title" -> stringAttr("All-access digital"),
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
                  "DigitalSubscription" -> mapAttr(
                    Map(
                      "title" -> stringAttr("Digital plus"),
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
              "tickerSettings" -> mapAttr(
                Map(
                  "currencySymbol" -> stringAttr("$"),
                  "copy" -> mapAttr(
                    Map("countLabel" -> stringAttr("test copy"), "goalCopy" -> stringAttr("test goal copy")),
                  ),
                  "name" -> stringAttr("US"),
                ),
              ),
              "countdownSettings" -> mapAttr(
                Map(
                  "overwriteHeadingLabel" -> stringAttr("test"),
                  "countdownStartTimestamp" -> stringAttr("2025-05-14T14:56:18"),
                  "countdownDeadlineTimestamp" -> stringAttr("2025-05-15T14:00"),
                  "useLocalTime" -> booleanAttr(false),
                  "theme" -> mapAttr(
                    Map(
                      "backgroundColor" -> stringAttr("#1e3e72"),
                      "foregroundColor" -> stringAttr("#ffffff"),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    )

    val result = parseDynamoRecord[LandingPageTest](dynamoTest.asJava)
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
            products = products,
            tickerSettings = {
              Some(
                TickerSettings(
                  currencySymbol = "$",
                  copy = TickerCopy(countLabel = "test copy", goalCopy = "test goal copy"),
                  name = "US",
                ),
              )
            },
            countdownSettings = {
              Some(
                CountdownSettings(
                  overwriteHeadingLabel = "test",
                  countdownStartTimestamp = "2025-05-14T14:56:18",
                  countdownDeadlineTimestamp = "2025-05-15T14:00",
                  useLocalTime = false,
                  theme = CountdownTheme(
                    backgroundColor = "#1e3e72",
                    foregroundColor = "#ffffff",
                  ),
                ),
              )
            },
            defaultProductSelection = None,
          ),
        ),
      ),
    )
  }
}
