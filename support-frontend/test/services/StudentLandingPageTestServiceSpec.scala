package services

import admin.settings.{Image, Institution, RegionTargeting, StudentLandingPageTest, StudentLandingPageVariant, Status}

import io.circe.Decoder
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters.{MapHasAsJava, SeqHasAsJava}

class StudentLandingPageTestServiceSpec extends AsyncFlatSpec with Matchers {

  private def parseDynamoRecord[T: Decoder](record: java.util.Map[String, AttributeValue]): Either[io.circe.Error, T] =
    DynamoJsonConverter.mapToJson(record).as[T]

  private def stringAttr(value: String): AttributeValue = AttributeValue.builder().s(value).build()
  private def numberAttr(value: Int): AttributeValue = AttributeValue.builder().n(value.toString).build()
  private def mapAttr(value: Map[String, AttributeValue]): AttributeValue =
    AttributeValue.builder().m(value.asJava).build()
  private def listAttr(value: List[AttributeValue]): AttributeValue = AttributeValue.builder().l(value.asJava).build()

  "StudentLandingPageTestService" should "parseStudentLandingPage" in {
    val dynamoTest = Map(
      "channel" -> stringAttr("StudentLandingPage"),
      "name" -> stringAttr("2026-02-09_SKB-REGION-FIX"),
      "status" -> stringAttr("Live"),
      "priority" -> numberAttr(1),
      "regionId" -> stringAttr("AUDCountries"),
      "variants" -> listAttr(
        List(
          mapAttr(
            Map(
              "name" -> stringAttr("offer"),
              "heading" -> stringAttr("Subscribe to fearless, independent and inspiring journalism"),
              "subheading" -> stringAttr(
                "For a limited time, students with a valid UTS email address can unlock the premium experience of Guardian journalism, including unmetered app access, free for two years.",
              ),
              "image" -> mapAttr(
                Map(
                  "altText" -> stringAttr("Feast and News Apps"),
                  "desktopUrl" -> stringAttr(
                    "https://i.guim.co.uk/img/media/e78041ba4789772737f9daa2f54682630ef6e3fa/0_0_880_586/880.jpg?quality=100&s=05fd530c55c7b5102fbbb7a509d1dd98",
                  ),
                  "mobileUrl" -> stringAttr(
                    "https://i.guim.co.uk/img/media/c36718611e0046117943fd69dfe67a4e5fb10f39/0_0_489_197/489.jpg?quality=100&s=de55d641047597a4fe5dce05f2d5105e",
                  ),
                  "tabletUrl" -> stringAttr(
                    "https://i.guim.co.uk/img/media/e78041ba4789772737f9daa2f54682630ef6e3fa/0_0_880_586/880.jpg?quality=100&s=05fd530c55c7b5102fbbb7a509d1dd98",
                  ),
                ),
              ),
              "institution" -> mapAttr(
                Map(
                  "acronym" -> stringAttr("UTS"),
                  "logoUrl" -> stringAttr("https://www.theguardian.com"),
                  "name" -> stringAttr("Guardian University"),
                ),
              ),
              "promoCodes" -> listAttr(
                List(
                  stringAttr("UTS_STUDENT"),
                ),
              ),
            ),
          ),
        ),
      ),
    )

    val result = parseDynamoRecord[StudentLandingPageTest](dynamoTest.asJava)
    result shouldBe Right(
      StudentLandingPageTest(
        name = "2026-02-09_SKB-REGION-FIX",
        status = Status.Live,
        priority = 1,
        regionId = "AUDCountries",
        variants = List(
          StudentLandingPageVariant(
            name = "offer",
            heading = "Subscribe to fearless, independent and inspiring journalism",
            subheading =
              "For a limited time, students with a valid UTS email address can unlock the premium experience of Guardian journalism, including unmetered app access, free for two years.",
            image = Image(
              altText = "Feast and News Apps",
              desktopUrl =
                "https://i.guim.co.uk/img/media/e78041ba4789772737f9daa2f54682630ef6e3fa/0_0_880_586/880.jpg?quality=100&s=05fd530c55c7b5102fbbb7a509d1dd98",
              mobileUrl =
                "https://i.guim.co.uk/img/media/c36718611e0046117943fd69dfe67a4e5fb10f39/0_0_489_197/489.jpg?quality=100&s=de55d641047597a4fe5dce05f2d5105e",
              tabletUrl =
                "https://i.guim.co.uk/img/media/e78041ba4789772737f9daa2f54682630ef6e3fa/0_0_880_586/880.jpg?quality=100&s=05fd530c55c7b5102fbbb7a509d1dd98",
            ),
            institution = Institution(
              name = "Guardian University",
              acronym = "UTS",
              logoUrl = "https://www.theguardian.com",
            ),
            promoCodes = List("UTS_STUDENT"),
          ),
        ),
      ),
    )
  }
}
