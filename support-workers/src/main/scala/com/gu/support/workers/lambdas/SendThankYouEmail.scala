package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
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
import org.joda.time.DateTime

import scala.concurrent.Future

case class StateNotValidException(message: String) extends RuntimeException(message)

class SendThankYouEmail(
    serviceProvider: ServiceProvider = ServiceProvider,
    emailService: EmailService = new EmailService(Configuration.emailQueueName),
) extends SubsetServicesHandler[SendAcquisitionEventState, Unit, SendThankYouEmailState](
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

    for {
      emailFields <- emailBuilder.buildEmail(state)
      _ = emailFields.map(emailService.send)
    } yield HandlerResult((), requestInfo)
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
    val threeTierEmailFields = new ThreeTierEmailFields(paperFieldsGenerator, touchpointEnvironment)

    state match {
      case contribution: SendThankYouEmailContributionState => contributionEmailFields.build(contribution).map(List(_))
      case supporterPlus: SendThankYouEmailSupporterPlusState =>
        supporterPlusEmailFields.build(supporterPlus).map(List(_))
      case threeTier: SendThankYouEmailTierThreeState =>
        threeTierEmailFields.build(threeTier).map(List(_))
      case digi: SendThankYouEmailDigitalSubscriptionState => digitalPackEmailFields.build(digi)
      case paper: SendThankYouEmailPaperState =>
        getAgentDetails(paper.product.deliveryAgent).flatMap(paperEmailFields.build(paper, _)).map(List(_))
      case weekly: SendThankYouEmailGuardianWeeklyState => guardianWeeklyEmailFields.build(weekly).map(List(_))
    }
  }

}
