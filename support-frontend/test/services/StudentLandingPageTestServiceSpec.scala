package services

import admin.settings.{
  Image,
  Institution,
  PromoCode,
  RegionTargeting,
  StudentLandingPageTest,
  StudentLandingPageVariant,
  Status,
}

import io.circe.Decoder
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import java.awt.Image

class StudentLandingPageTestServiceSpec extends AsynchFlatSpec with Matchers {

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
      "name" -> stringAttr("2026-02-11_SKB-VALIDATION-TEST"),
      "status" -> stringAttr("Live"),
      "priority" -> numberAttr(3),
      "regionId" -> stringAttr("AUDCountries"),
      "variants" -> ListAttr(
        List(
          mapAttr(
            Map(
              "name" -> stringAttr("offer"),
              "heading" -> stringAttr("test heading"),
              "subheading" -> stringAttr("test subheading"),
              "image" -> MapAttr(
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
              "institution" -> MapAttr(
                "name" -> stringAttr("Guardian University"),
                "acronym" -> stringAttr("UTS"),
                "logoUrl" -> stringAttr("https://www.theguardian.com"),
              ),
              "promoCodes" -> MapAttr(
                Map(
                  "value" -> ListAttr(List(stringAttr("UTS_STUDENT"))),
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
        name = "2026-02-11_SKB-VALIDATION-TEST",
        status = Status.Live,
        priority = 3,
        regionId = "AUDCountries",
        variants = List(
          StudentLandingPageVariant(
            name = "offer",
            heading = "test heading",
            subheading = "test subheading",
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
            promoCodes = PromoCode(
              value = List("UTS_STUDENT"),
            ),
          ),
        ),
      ),
    )
  }
}
