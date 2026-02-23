package services

import admin.settings.{
  AmountsSelection,
  RegionTargeting,
  OneTimeCheckoutTest,
  OneTimeCheckoutVariant,
  Status,
  TickerCopy,
  TickerSettings,
}
import io.circe.Decoder
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters.{MapHasAsJava, SeqHasAsJava}

class OneTimeCheckoutTestServiceSpec extends AsyncFlatSpec with Matchers {

  private def parseDynamoRecord[T: Decoder](record: java.util.Map[String, AttributeValue]): Either[io.circe.Error, T] =
    DynamoJsonConverter.mapToJson(record).as[T]

  private def stringAttr(value: String): AttributeValue = AttributeValue.builder().s(value).build()
  private def booleanAttr(value: Boolean): AttributeValue = AttributeValue.builder().bool(value).build()
  private def numberAttr(value: Int): AttributeValue = AttributeValue.builder().n(value.toString).build()
  private def mapAttr(value: Map[String, AttributeValue]): AttributeValue =
    AttributeValue.builder().m(value.asJava).build()
  private def listAttr(value: List[AttributeValue]): AttributeValue = AttributeValue.builder().l(value.asJava).build()

  "OneTimeCheckoutTestService" should "parseOneTimeCheckoutTest" in {
    val dynamoTest = Map(
      "channel" -> stringAttr("OneTimeCheckout"),
      "name" -> stringAttr("test1"),
      "priority" -> numberAttr(5),
      "status" -> stringAttr("Live"),
      "regionTargeting" -> mapAttr(
        Map(
          "targetedCountryGroups" -> listAttr(List(stringAttr("GBPCountries"), stringAttr("UnitedStates"))),
        ),
      ),
      "variants" -> listAttr(
        List(
          mapAttr(
            Map(
              "name" -> stringAttr("control"),
              "heading" -> stringAttr("Support the Guardian"),
              "subheading" -> stringAttr("Help us deliver independent journalism"),
              "amounts" -> mapAttr(
                Map(
                  "amounts" -> listAttr(List(numberAttr(5), numberAttr(10), numberAttr(20))),
                  "defaultAmount" -> numberAttr(10),
                  "hideChooseYourAmount" -> booleanAttr(false),
                ),
              ),
              "tickerSettings" -> mapAttr(
                Map(
                  "currencySymbol" -> stringAttr("£"),
                  "copy" -> mapAttr(
                    Map(
                      "countLabel" -> stringAttr("supporters in the last month"),
                      "goalCopy" -> stringAttr("our goal"),
                    ),
                  ),
                  "name" -> stringAttr("UK"),
                ),
              ),
            ),
          ),
          mapAttr(
            Map(
              "name" -> stringAttr("variant"),
              "heading" -> stringAttr("Make a contribution"),
              "subheading" -> stringAttr("Your support powers our journalism"),
              "amounts" -> mapAttr(
                Map(
                  "amounts" -> listAttr(List(numberAttr(7), numberAttr(15), numberAttr(25))),
                  "defaultAmount" -> numberAttr(15),
                  "hideChooseYourAmount" -> booleanAttr(true),
                ),
              ),
            ),
          ),
        ),
      ),
    )

    val result = parseDynamoRecord[OneTimeCheckoutTest](dynamoTest.asJava)
    result shouldBe Right(
      OneTimeCheckoutTest(
        name = "test1",
        status = Status.Live,
        priority = 5,
        regionTargeting = Some(
          RegionTargeting(
            targetedCountryGroups = List("GBPCountries", "UnitedStates"),
          ),
        ),
        mParticleAudience = None,
        variants = List(
          OneTimeCheckoutVariant(
            name = "control",
            heading = "Support the Guardian",
            subheading = "Help us deliver independent journalism",
            amounts = AmountsSelection(
              amounts = List(5, 10, 20),
              defaultAmount = 10,
              hideChooseYourAmount = Some(false),
            ),
            tickerSettings = Some(
              TickerSettings(
                currencySymbol = "£",
                copy = TickerCopy(countLabel = "supporters in the last month", goalCopy = "our goal"),
                name = "UK",
              ),
            ),
          ),
          OneTimeCheckoutVariant(
            name = "variant",
            heading = "Make a contribution",
            subheading = "Your support powers our journalism",
            amounts = AmountsSelection(
              amounts = List(7, 15, 25),
              defaultAmount = 15,
              hideChooseYourAmount = Some(true),
            ),
            tickerSettings = None,
          ),
        ),
      ),
    )
  }

  it should "parseOneTimeCheckoutTest without optional fields" in {
    val dynamoTest = Map(
      "channel" -> stringAttr("OneTimeCheckout"),
      "name" -> stringAttr("minimal-test"),
      "priority" -> numberAttr(1),
      "status" -> stringAttr("Draft"),
      "variants" -> listAttr(
        List(
          mapAttr(
            Map(
              "name" -> stringAttr("control"),
              "heading" -> stringAttr("Support us"),
              "subheading" -> stringAttr("Contribute today"),
              "amounts" -> mapAttr(
                Map(
                  "amounts" -> listAttr(List(numberAttr(3), numberAttr(5), numberAttr(10))),
                  "defaultAmount" -> numberAttr(5),
                ),
              ),
            ),
          ),
        ),
      ),
    )

    val result = parseDynamoRecord[OneTimeCheckoutTest](dynamoTest.asJava)
    result shouldBe Right(
      OneTimeCheckoutTest(
        name = "minimal-test",
        status = Status.Draft,
        priority = 1,
        regionTargeting = None,
        mParticleAudience = None,
        variants = List(
          OneTimeCheckoutVariant(
            name = "control",
            heading = "Support us",
            subheading = "Contribute today",
            amounts = AmountsSelection(
              amounts = List(3, 5, 10),
              defaultAmount = 5,
              hideChooseYourAmount = None,
            ),
            tickerSettings = None,
          ),
        ),
      ),
    )
  }
}
