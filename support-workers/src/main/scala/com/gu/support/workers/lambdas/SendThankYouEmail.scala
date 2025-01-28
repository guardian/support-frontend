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

    emailBuilder.buildEmail(state).map(emailFields => HandlerResult(emailService.send(emailFields), requestInfo))
  }

}

class EmailBuilder(
    getMandate: String => Future[Option[String]],
    getAgentDetails: Option[AgentId] => Future[Option[AgentDetails]],
    promotionService: PromotionService,
    stage: Stage,
) {
  val paperFieldsGenerator = new PaperFieldsGenerator(getMandate)

  def buildEmail(state: SendThankYouEmailState): Future[EmailFields] = {
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
    val tierThreeEmailFields = new TierThreeEmailFields(paperFieldsGenerator, touchpointEnvironment)
    val guardianAdLiteEmailFields = new GuardianAdLiteEmailFields(created = DateTime.now())

    state match {
      case contribution: SendThankYouEmailContributionState => contributionEmailFields.build(contribution)
      case supporterPlus: SendThankYouEmailSupporterPlusState =>
        supporterPlusEmailFields.build(supporterPlus)
      case tierThree: SendThankYouEmailTierThreeState =>
        tierThreeEmailFields.build(tierThree)
      case digi: SendThankYouEmailDigitalSubscriptionState => digitalPackEmailFields.build(digi)
      case paper: SendThankYouEmailPaperState =>
        getAgentDetails(paper.product.deliveryAgent).flatMap(paperEmailFields.build(paper, _))
      case weekly: SendThankYouEmailGuardianWeeklyState => guardianWeeklyEmailFields.build(weekly)
      case guardianAdLite: SendThankYouEmailGuardianAdLiteState =>
        guardianAdLiteEmailFields.build(guardianAdLite)
    }
  }

}
