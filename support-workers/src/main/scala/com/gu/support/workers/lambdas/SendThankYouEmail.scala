package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.amazonaws.services.sqs.model.SendMessageResult
import com.gu.config.Configuration
import com.gu.emailservices._
import com.gu.services.{ServiceProvider, Services}
import com.gu.support.config.{Stage, TouchPointEnvironments}
import com.gu.support.paperround.AgentId
import com.gu.support.paperround.AgentsEndpoint.AgentDetails
import com.gu.support.promotions.PromotionService
import com.gu.support.workers._
import com.gu.support.workers.states.SendThankYouEmailState._
import com.gu.support.workers.states.{SendAcquisitionEventState, SendThankYouEmailState}
import com.gu.threadpools.CustomPool.executionContext
import io.circe.generic.auto._
import org.joda.time.DateTime

import scala.concurrent.Future

case class StateNotValidException(message: String) extends RuntimeException(message)

class SendThankYouEmail(
    serviceProvider: ServiceProvider = ServiceProvider,
    emailService: EmailService = new EmailService(Configuration.emailQueueName),
) extends SubsetServicesHandler[SendAcquisitionEventState, List[SendMessageResult], SendThankYouEmailState](
      serviceProvider,
      _.sendThankYouEmailState,
    ) {

  def this() = this(ServiceProvider)

  override protected def subsetHandler(
      state: SendThankYouEmailState,
      requestInfo: RequestInfo,
      context: Context,
      services: Services,
  ): FutureHandlerResult = {
    def getAgentDetails(agentId: Option[AgentId]): Future[Option[AgentDetails]] =
      agentId match {
        case None => Future.successful(None)
        case Some(id) =>
          for {
            response <- services.paperRoundService.agents()
          } yield response.data.agents.find(_.refId == id)
      }

    val emailBuilder = new EmailBuilder(
      services.zuoraService.getMandateIdFromAccountNumber,
      getAgentDetails,
      services.promotionService,
      Configuration.stage,
    )

    /** We generate these `test.e2e.supporter.revenue` emails as part of our e2e testing and don't want to create a
      * braze user for them as if the emails bounce it might affect our reputation with email clients in the long run.
      *
      * see: support-e2e/tests/utils/users.ts
      *
      * We cannot use `isTestUser` as we do actually use this for testing receiving of emails and it _might_ still have
      * a negative affect on the reputation as email clients are not aware it is a test account.
      */
    val email = state.user.primaryEmailAddress
    if (email.startsWith("test.e2e.supporter.revenue") && email.endsWith("theguardian.com")) {
      Future.successful(HandlerResult(Nil, requestInfo))
    } else {
      for {
        emailFields <- emailBuilder.buildEmail(state)
        emailResult <- Future.sequence(emailFields.map(emailService.send))
      } yield HandlerResult(emailResult, requestInfo)
    }
  }
}

class EmailBuilder(
    getMandate: String => Future[Option[String]],
    getAgentDetails: Option[AgentId] => Future[Option[AgentDetails]],
    promotionService: PromotionService,
    stage: Stage,
) {
  val paperFieldsGenerator = new PaperFieldsGenerator(promotionService, getMandate)

  def buildEmail(state: SendThankYouEmailState): Future[List[EmailFields]] = {
    val touchpointEnvironment = TouchPointEnvironments.fromStage(stage, state.user.isTestUser)

    val digitalPackEmailFields = new DigitalPackEmailFields(paperFieldsGenerator, getMandate, touchpointEnvironment)
    val paperEmailFields = new PaperEmailFields(paperFieldsGenerator, touchpointEnvironment)
    val guardianWeeklyEmailFields = new GuardianWeeklyEmailFields(paperFieldsGenerator, touchpointEnvironment)
    val contributionEmailFields = new ContributionEmailFields(getMandate, created = DateTime.now())
    val supporterPlusEmailFields = new SupporterPlusEmailFields(
      paperFieldsGenerator,
      getMandate,
      touchpointEnvironment,
      created = DateTime.now(),
    )

    state match {
      case contribution: SendThankYouEmailContributionState => contributionEmailFields.build(contribution).map(List(_))
      case supporterPlus: SendThankYouEmailSupporterPlusState =>
        supporterPlusEmailFields.build(supporterPlus).map(List(_))
      case digi: SendThankYouEmailDigitalSubscriptionState => digitalPackEmailFields.build(digi)
      case paper: SendThankYouEmailPaperState =>
        getAgentDetails(paper.product.deliveryAgent).flatMap(paperEmailFields.build(paper, _)).map(List(_))
      case weekly: SendThankYouEmailGuardianWeeklyState => guardianWeeklyEmailFields.build(weekly).map(List(_))
    }
  }

}
