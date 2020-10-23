package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.promotions.PromotionService
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailProductSpecificState._
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.threadpools.CustomPool.executionContext
import io.circe.generic.auto._
import org.joda.time.DateTime

import scala.concurrent.Future

case class StateNotValidException(message: String) extends RuntimeException(message)

class SendThankYouEmail(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[SendThankYouEmailState, List[SendMessageResult]](servicesProvider) {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(
    state: SendThankYouEmailState,
    requestInfo: RequestInfo,
    context: Context,
    services: Services
  ): FutureHandlerResult = {
    val thankYouEmailService: EmailService = new EmailService(services.config.contributionThanksQueueName)
    val emailBuilder = new EmailBuilder(services.zuoraService.getMandateIdFromAccountNumber, services.promotionService, Configuration.stage)

    for {
      emailFields <- emailBuilder.buildEmail(state)
      emailResult <- Future.sequence(emailFields.map(thankYouEmailService.send))
    } yield HandlerResult(emailResult, requestInfo)
  }

}

class EmailBuilder(
  getMandate: String => Future[Option[String]],
  promotionService: PromotionService,
  stage: Stage,
) {
  val paperFieldsGenerator = new PaperFieldsGenerator(promotionService, getMandate)

  def buildEmail(state: SendThankYouEmailState): Future[List[EmailFields]] = {
    val touchpointEnvironment = TouchPointEnvironments.fromStage(stage, state.user.isTestUser)
    val sfContactId = SfContactId(state.salesForceContact.Id)

    val digitalPackEmailFields = new DigitalPackEmailFields(paperFieldsGenerator, getMandate, touchpointEnvironment, state.user, sfContactId)
    val paperEmailFields = new PaperEmailFields(paperFieldsGenerator, touchpointEnvironment, state.user, sfContactId)
    val guardianWeeklyEmailFields = new GuardianWeeklyEmailFields(paperFieldsGenerator, touchpointEnvironment, state.user, sfContactId)
    val contributionEmailFields = new ContributionEmailFields(getMandate, state.user, sfContactId, created = DateTime.now())

    state.sendThankYouEmailProductState match {
      case contribution: SendThankYouEmailContributionState => contributionEmailFields.build(contribution).map(List(_))
      case digi: SendThankYouEmailDigitalSubscriptionState => digitalPackEmailFields.build(digi)
      case paper: SendThankYouEmailPaperState => paperEmailFields.build(paper).map(List(_))
      case weekly: SendThankYouEmailGuardianWeeklyState => guardianWeeklyEmailFields.build(weekly).map(List(_))
    }
  }

}
