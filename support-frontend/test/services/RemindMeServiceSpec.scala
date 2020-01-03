package services

import com.gu.support.config.Stages.DEV
import controllers.ReminderEventRequest
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import org.scalatestplus.mockito.MockitoSugar

class RemindMeServiceSpec extends AnyFlatSpec with Matchers with MockitoSugar  {
  "contructPayload" should "construct a usable json object with email and reminder date fields inside a ReminderCreatedEvent field" in {
    val remindMeService = new RemindMeService(DEV)
    val reminderEventRequest = ReminderEventRequest(email = "test@theguardian.com", reminderDate = "2020-12-12 10:10:10")
    remindMeService.contructPayload(reminderEventRequest) shouldBe
      "{\"ReminderCreatedEvent\":{\"email\":\"test@theguardian.com\",\"reminderDate\":\"2020-12-12 10:10:10\"}," +
        "\"body\":\"{\\\"email\\\":\\\"test@theguardian.com\\\",\\\"reminderDate\\\":\\\"2020-12-12 10:10:10\\\"}\"}"
  }
}
