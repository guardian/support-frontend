package com.gu.patrons.lambdas

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.model.{
  ConfigLoadingError,
  SignUpError,
  InvalidJsonError,
  InvalidRequestError,
  StripeGetCustomerFailedError,
  StageConstructors,
  ExpandedStripeCustomer,
  UnexpandedStripeCustomer,
  StripeSubscription,
  SubscriptionProcessingError,
}
import com.gu.patrons.services.{
  PatronsIdentityService,
  PatronsStripeService,
  PatronsStripeAccount,
  GnmPatronScheme,
  GnmPatronSchemeAus,
  SubscriptionProcessor,
  CreateMissingIdentityProcessor,
}
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.stripe.net.Webhook
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import io.circe.parser.decode

import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.{Duration, DurationInt, MINUTES}
import scala.jdk.CollectionConverters.MapHasAsScala
import scala.util.{Failure, Success, Try}

object PatronSignUpEventLambda extends StrictLogging {
  val runner = configurableFutureRunner(60.seconds)

  def handleRequest(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    Await.result(
      signUpCustomerInDynamoDb(event, StageConstructors.fromEnvironment),
      Duration(15, MINUTES),
    )
  }

  def signUpCustomerInDynamoDb(
      event: APIGatewayProxyRequestEvent,
      stage: Stage,
  ): Future[APIGatewayProxyResponseEvent] = {
    implicit val stage = StageConstructors.fromEnvironment
    (for {
      stripeConfig <- getStripeConfig(stage)
      identityConfig <- getIdentityConfig(stage)
      identityService = new PatronsIdentityService(identityConfig, runner)
      account = if (event.getPathParameters.get("countryId") == "au") GnmPatronSchemeAus else GnmPatronScheme
      payload <- getPayload(
        event,
        account match {
          case GnmPatronSchemeAus => stripeConfig.signUpHookSigningSecretAustralia
          case GnmPatronScheme => stripeConfig.signUpHookSigningSecret
        },
      )
      event <- getEvent(payload)
      customer <- getCustomer(stripeConfig, account, event.data.`object`.customer.id)
      dynamoService = SupporterDataDynamoService(stage)
      unit <- processSubscription(
        new CreateMissingIdentityProcessor(identityService, dynamoService),
        StripeSubscription.expandCustomerInfo(customer, event.data.`object`),
      )
    } yield unit).value.map(getAPIGatewayResult(_))
  }

  def getAPIGatewayResult(result: Either[SignUpError, Unit]) = {
    val response = new APIGatewayProxyResponseEvent()
    result match {
      case Left(error @ (ConfigLoadingError(_) | SubscriptionProcessingError(_) | StripeGetCustomerFailedError(_))) =>
        logger.error(error.message)
        response.setStatusCode(500)
        response.setBody(error.message)
      case Left(error @ (InvalidRequestError(_) | InvalidJsonError(_))) =>
        logger.error(error.message)
        response.setStatusCode(400)
        response.setBody(error.message)
      case Right(_) =>
        logger.info("Successfully created Patron subscription")
        response.setStatusCode(200)
        response.setBody("Successfully created Patron subscription")
    }
    response
  }

  def getStripeConfig(stage: Stage): EitherT[Future, SignUpError, PatronsStripeConfig] = {
    logger.info("Attempting to fetch Stripe config information from parameter store")
    val futureConfig: Future[Either[SignUpError, PatronsStripeConfig]] = PatronsStripeConfig
      .fromParameterStore(stage)
      .transform {
        case Success(config) => Try(Right(config))
        case Failure(err) => Try(Left(ConfigLoadingError(err.getMessage)))
      }
    EitherT(futureConfig)
  }

  def getIdentityConfig(stage: Stage): EitherT[Future, SignUpError, PatronsIdentityConfig] = {
    logger.info("Attempting to fetch Identity config information from parameter store")
    val futureConfig: Future[Either[SignUpError, PatronsIdentityConfig]] = PatronsIdentityConfig
      .fromParameterStore(stage)
      .transform {
        case Success(config) => Try(Right(config))
        case Failure(err) => Try(Left(ConfigLoadingError(err.getMessage)))
      }
    EitherT(futureConfig)
  }

  def getPayload(
      event: APIGatewayProxyRequestEvent,
      signingSecret: String,
  ): EitherT[Future, SignUpError, String] = {
    logger.info("Attempting to verify event payload")
    EitherT.fromEither(for {
      payload <- Option(event.getBody).toRight(InvalidRequestError("Missing body"))
      _ = SafeLogger.info(s"payload is ${payload.replace("\n", "")}")
      sigHeader <- event.getHeaders.asScala.get("Stripe-Signature").toRight(InvalidRequestError("Missing sig header"))
      _ <- Try(
        Webhook.Signature.verifyHeader(payload, sigHeader, signingSecret, 300),
      ).toEither.left.map(e => InvalidRequestError(e.getMessage))
      _ = logger.info(s"payload successfully verified")
    } yield payload)
  }

  def getEvent(payload: String): EitherT[Future, SignUpError, PatronSignUpEvent] = {
    logger.info(s"Attempting to decode event from payload")
    EitherT.fromEither(decode[PatronSignUpEvent](payload).left.map(e => InvalidJsonError(e.getMessage)))
  }

  def getCustomer(
      config: PatronsStripeConfig,
      account: PatronsStripeAccount,
      customerId: String,
  ): EitherT[Future, SignUpError, ExpandedStripeCustomer] = {
    logger.info(s"Attempting to retrieve customer with id $customerId from Stripe")
    val stripeService = new PatronsStripeService(config, runner)
    val futureCustomer = stripeService.getCustomer(account, customerId).transform {
      case Success(customer) => Try(Right(customer))
      case Failure(err) =>
        Try(
          Left(
            StripeGetCustomerFailedError(
              s"Couldn't retrieve customer with id $customerId from Stripe because of error - ${err.getMessage}",
            ),
          ),
        )
    }
    EitherT(futureCustomer)
  }

  def processSubscription(
      processor: SubscriptionProcessor,
      subscription: StripeSubscription[ExpandedStripeCustomer],
  ): EitherT[Future, SignUpError, Unit] = {
    logger.info(s"Attempting to process subscription")
    EitherT(processor.processSubscription(subscription).transform {
      case Success(()) => Try(Right(()))
      case Failure(err) => Try(Left(SubscriptionProcessingError(err.getMessage)))
    })
  }

}

case class PatronSignUpEvent(data: PatronSignUpData)
case class PatronSignUpData(`object`: StripeSubscription[UnexpandedStripeCustomer])

object PatronSignUpEvent {
  implicit val decoder: Decoder[PatronSignUpEvent] = deriveDecoder
  implicit val dataDecoder: Decoder[PatronSignUpData] = deriveDecoder
}
