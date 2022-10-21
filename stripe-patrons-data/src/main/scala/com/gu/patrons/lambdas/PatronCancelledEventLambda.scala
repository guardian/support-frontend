package com.gu.patrons.lambdas

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.model.{
  ConfigLoadingError,
  DynamoDbError,
  Error,
  InvalidJsonError,
  InvalidRequestError,
  StageConstructors,
  UserNotFoundIdentityError,
  UserNotFoundStripeError,
}
import com.gu.patrons.services.PatronsIdentityService
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.services.SupporterDataDynamoService
import com.stripe.Stripe
import com.stripe.model.Customer
import com.stripe.net.Webhook
import com.typesafe.scalalogging.StrictLogging
import io.circe.Decoder
import io.circe.generic.semiauto.deriveDecoder
import io.circe.parser.decode
import software.amazon.awssdk.services.dynamodb.model.UpdateItemResponse

import java.time.LocalDate
import scala.concurrent.{Await, Future}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.{Duration, DurationInt, MINUTES}
import scala.jdk.CollectionConverters.MapHasAsScala
import scala.util.{Failure, Success, Try}

object PatronCancelledEventLambda extends StrictLogging {
  val runner = configurableFutureRunner(60.seconds)

  def handleRequest(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    Await.result(
      deleteCustomerFromDynamoDb(event),
      Duration(15, MINUTES),
    )
  }

  def deleteCustomerFromDynamoDb(event: APIGatewayProxyRequestEvent): Future[APIGatewayProxyResponseEvent] = {
    val stage = StageConstructors.fromEnvironment
    SafeLogger.info(s"Path is ${event.getPathParameters.get("countryId")}")

    (for {
      stripeConfig <- getStripeConfig(stage)
      identityConfig <- getIdentityConfig(stage)
      payload <- getPayload(event, stripeConfig.signingSecret)
      event <- getEvent(payload)
      customer <- getCustomer(stripeConfig, event.customerId)
      identityId <- getIdentityId(identityConfig, customer.getEmail)
      _ <- cancelSubscription(stage, identityId, event.subscriptionId)
    } yield ()).value.map(getAPIGatewayResult)
  }

  def getAPIGatewayResult(result: Either[Error, Unit]) = {
    val response = new APIGatewayProxyResponseEvent()
    result match {
      case Left(error @ (ConfigLoadingError(_) | DynamoDbError(_))) =>
        logger.error(error.message)
        response.setStatusCode(500)
        response.setBody(error.message)
      case Left(error @ (InvalidRequestError(_) | InvalidJsonError(_))) =>
        logger.error(error.message)
        response.setStatusCode(400)
        response.setBody(error.message)
      case Left(error @ (UserNotFoundIdentityError(_) | UserNotFoundStripeError(_))) =>
        logger.error(error.message)
        response.setStatusCode(200)
        response.setBody(error.message)
      case Right(_) =>
        logger.info("Successfully cancelled Patron subscription")
        response.setStatusCode(200)
        response.setBody("Successfully cancelled Patron subscription")
    }
    response
  }

  def getStripeConfig(stage: Stage): EitherT[Future, Error, PatronsStripeConfig] = {
    logger.info("Attempting to fetch Stripe config information from parameter store")
    val futureConfig: Future[Either[Error, PatronsStripeConfig]] = PatronsStripeConfig
      .fromParameterStore(stage)
      .transform {
        case Success(config) => Try(Right(config))
        case Failure(err) => Try(Left(ConfigLoadingError(err.getMessage)))
      }
    EitherT(futureConfig)
  }

  def getIdentityConfig(stage: Stage): EitherT[Future, Error, PatronsIdentityConfig] = {
    logger.info("Attempting to fetch Identity config information from parameter store")
    val futureConfig: Future[Either[Error, PatronsIdentityConfig]] = PatronsIdentityConfig
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
  ): EitherT[Future, Error, String] = {
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

  def getEvent(payload: String): EitherT[Future, Error, PatronCancelledEvent] = {
    logger.info(s"Attempting to decode event from payload")
    EitherT.fromEither(decode[PatronCancelledEvent](payload).left.map(e => InvalidJsonError(e.getMessage)))
  }

  def getCustomer(config: PatronsStripeConfig, customerId: String): EitherT[Future, Error, Customer] = {
    logger.info(s"Attempting to retrieve customer with id $customerId from Stripe")
    Stripe.apiKey = config.apiKey
    EitherT.fromEither(Try(Customer.retrieve(customerId)).toEither.left.map(e => UserNotFoundStripeError(e.getMessage)))
  }

  def getIdentityId(
      config: PatronsIdentityConfig,
      email: String,
  ): EitherT[Future, UserNotFoundIdentityError, String] = {
    logger.info(s"Attempting to find identity id for user with email $email")
    val identityService = new PatronsIdentityService(config, runner)
    EitherT(
      identityService
        .getUserIdFromEmail(email)
        .map(_.toRight(UserNotFoundIdentityError(s"No identity id found for email $email"))),
    )
  }

  def cancelSubscription(
      stage: Stage,
      identityId: String,
      subscriptionId: String,
  ): EitherT[Future, Error, UpdateItemResponse] = {
    logger.info(
      s"Attempting to cancel Patron subscription for user with identity id $identityId and subscription id $subscriptionId",
    )
    val dynamoService = SupporterDataDynamoService(stage)
    EitherT(dynamoService.cancelSubscription(identityId, subscriptionId, LocalDate.now).map(_.left.map(DynamoDbError)))
  }
}

case class PatronCancelledEvent(data: PatronCancelledData, `type`: String) {
  def customerId = data.`object`.customer
  def subscriptionId = data.`object`.id
}
object PatronCancelledEvent {
  implicit val decoder: Decoder[PatronCancelledEvent] = deriveDecoder
  implicit val dataDecoder: Decoder[PatronCancelledData] = deriveDecoder
  implicit val objectDecoder: Decoder[PatronSubscription] = deriveDecoder
}
case class PatronCancelledData(`object`: PatronSubscription)
case class PatronSubscription(customer: String, id: String)
