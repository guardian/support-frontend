package com.gu.patrons.lambdas

import cats.data.EitherT
import com.amazonaws.services.lambda.runtime.events.{APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent}
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.patrons.conf.{PatronsIdentityConfig, PatronsStripeConfig}
import com.gu.patrons.model.{
  ConfigLoadingError,
  DynamoDbError,
  CancelError,
  InvalidJsonError,
  InvalidRequestError,
  StageConstructors,
  ExpandedStripeCustomer,
  SubscriptionNotFoundDynamo,
  UserNotFoundIdentityError,
  UserNotFoundStripeError,
}
import com.gu.patrons.services.{
  PatronsIdentityService,
  PatronsStripeService,
  PatronsStripeAccount,
  GnmPatronScheme,
  GnmPatronSchemeAus,
}
import com.gu.supporterdata.model.Stage
import com.gu.supporterdata.services.SupporterDataDynamoService
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
import okhttp3.{Request, Response}

class PatronCancelledEventLambda extends StrictLogging {
  val runner: Request => Future[Response] = configurableFutureRunner(60.seconds)

  implicit val stage: Stage = StageConstructors.fromEnvironment
  private val stripeConfig = PatronsStripeConfig.fromParameterStoreSync(stage)
  private val identityConfig = PatronsIdentityConfig.fromParameterStoreSync(stage)

  def handleRequest(event: APIGatewayProxyRequestEvent): APIGatewayProxyResponseEvent = {
    Await.result(
      cancelCustomerInDynamoDb(event),
      Duration(15, MINUTES),
    )
  }

  def cancelCustomerInDynamoDb(event: APIGatewayProxyRequestEvent): Future[APIGatewayProxyResponseEvent] = {
    val countryId = event.getPathParameters.get("countryId")
    logger.info(s"Path is ${countryId}")
    val account = if (countryId == "au") GnmPatronSchemeAus else GnmPatronScheme

    (for {
      payload <- getPayload(
        event,
        account match {
          case GnmPatronScheme => stripeConfig.cancelledHookSigningSecret
          case GnmPatronSchemeAus => stripeConfig.cancelledHookSigningSecretAu
        },
      )
      event <- getEvent(payload)
      customer <- getCustomer(stripeConfig, account, event.customerId)
      _ <- cancelSubscriptionForEmail(customer.email, event.subscriptionId, identityConfig)
      _ <- maybeCancelJointPatron(customer, event.subscriptionId, identityConfig)
    } yield ()).value.map(getAPIGatewayResult)
  }

  def cancelSubscriptionForEmail(email: String, subscriptionId: String, identityConfig: PatronsIdentityConfig)(implicit
      stage: Stage,
  ): EitherT[Future, CancelError, Unit] = for {
    identityId <- getIdentityId(identityConfig, email)
    _ <- cancelSubscription(stage, identityId, subscriptionId)
  } yield ()

  def maybeCancelJointPatron(
      customer: ExpandedStripeCustomer,
      subscriptionId: String,
      identityConfig: PatronsIdentityConfig,
  )(implicit
      stage: Stage,
  ): EitherT[Future, CancelError, Unit] =
    customer.jointPatronEmail match {
      case Some(email) =>
        logger.info(s"Customer ${customer.email} has an associated joint patron - $email")
        cancelSubscriptionForEmail(email, subscriptionId, identityConfig)
      case _ =>
        EitherT.pure(())
    }

  def getAPIGatewayResult(result: Either[CancelError, Unit]): APIGatewayProxyResponseEvent = {
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
      case Left(notFoundDynamo @ SubscriptionNotFoundDynamo(_)) =>
        logger.warn(notFoundDynamo.message)
        response.setStatusCode(200)
        response.setBody(notFoundDynamo.message)
      case Right(_) =>
        logger.info("Successfully cancelled Patron subscription")
        response.setStatusCode(200)
        response.setBody("Successfully cancelled Patron subscription")
    }
    response
  }

  def getPayload(
      event: APIGatewayProxyRequestEvent,
      signingSecret: String,
  ): EitherT[Future, CancelError, String] = {
    logger.info("Attempting to verify event payload")
    EitherT.fromEither(for {
      payload <- Option(event.getBody).toRight(InvalidRequestError("Missing body"))
      _ = logger.info(s"payload is ${payload.replace("\n", "")}")
      sigHeader <- event.getHeaders.asScala.get("Stripe-Signature").toRight(InvalidRequestError("Missing sig header"))
      _ <- Try(
        Webhook.Signature.verifyHeader(payload, sigHeader, signingSecret, 300),
      ).toEither.left.map(e => InvalidRequestError(e.getMessage))
      _ = logger.info(s"payload successfully verified")
    } yield payload)
  }

  def getEvent(payload: String): EitherT[Future, CancelError, PatronCancelledEvent] = {
    logger.info(s"Attempting to decode event from payload")
    EitherT.fromEither(decode[PatronCancelledEvent](payload).left.map(e => InvalidJsonError(e.getMessage)))
  }

  def getCustomer(
      config: PatronsStripeConfig,
      account: PatronsStripeAccount,
      customerId: String,
  ): EitherT[Future, CancelError, ExpandedStripeCustomer] = {
    logger.info(s"Attempting to retrieve customer with id $customerId from Stripe")
    val stripeService = new PatronsStripeService(config, runner)
    val futureCustomer = stripeService.getCustomer(account, customerId).transform {
      case Success(customer) => Try(Right(customer))
      case Failure(err) =>
        Try(
          Left(
            UserNotFoundStripeError(
              s"Couldn't retrieve customer with id $customerId from Stripe because of error - ${err.getMessage}",
            ),
          ),
        )
    }
    EitherT(futureCustomer)
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
  ): EitherT[Future, CancelError, UpdateItemResponse] = {
    logger.info(
      s"Attempting to cancel Patron subscription for user with identity id " +
        s"$identityId and subscription id $subscriptionId",
    )
    val dynamoService = SupporterDataDynamoService(stage)
    val cancellationResult: Future[Either[CancelError, UpdateItemResponse]] =
      dynamoService.subscriptionExists(identityId, subscriptionId).flatMap {
        case Right(userExists) if userExists =>
          dynamoService
            .cancelSubscription(identityId, subscriptionId, LocalDate.now)
            .map(_.left.map(DynamoDbError))
        case Right(_) =>
          Future.successful(
            Left(
              SubscriptionNotFoundDynamo(
                s"Subscription with identity id $identityId and subscription id $subscriptionId " +
                  s"was not found in Dynamo DB, it may have been removed because of an expired TTL " +
                  s"https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html",
              ),
            ),
          )
        case Left(errorMessage) => Future.successful(Left(DynamoDbError(errorMessage)))
      }
    EitherT(cancellationResult)
  }
}

case class PatronCancelledEvent(data: PatronCancelledData, `type`: String) {
  def customerId: String = data.`object`.customer
  def subscriptionId: String = data.`object`.id
}
object PatronCancelledEvent {
  implicit val decoder: Decoder[PatronCancelledEvent] = deriveDecoder
  implicit val dataDecoder: Decoder[PatronCancelledData] = deriveDecoder
  implicit val objectDecoder: Decoder[PatronSubscription] = deriveDecoder
}
case class PatronCancelledData(`object`: PatronSubscription)
case class PatronSubscription(customer: String, id: String)
