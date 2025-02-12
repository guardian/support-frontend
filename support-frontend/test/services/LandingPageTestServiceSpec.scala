package services

import admin.settings.{LandingPageCopy, LandingPageTest, LandingPageTestTargeting, LandingPageVariant, Status}
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
      "targeting" -> AttributeValue
        .builder()
        .m(
          Map(
            "countryGroups" -> AttributeValue
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
        targeting = LandingPageTestTargeting(
          countryGroups = List("GBPCountries"),
        ),
        variants = List(
          LandingPageVariant(
            name = "control",
            copy = LandingPageCopy(
              heading = "test heading",
              subheading = "test subheading",
            ),
          ),
        ),
      ),
    )
  }
}
