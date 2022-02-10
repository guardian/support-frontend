package actions

import com.github.blemale.scaffeine.{Cache, Scaffeine}
import com.typesafe.scalalogging.StrictLogging
import controllers.JsonUtils
import model.{PaymentProvider, ResultBody}
import play.api.mvc._
import services.CloudWatchService

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration.FiniteDuration
import play.api.libs.circe.Circe

/** Simple rate-limiting by IP address. Note - there is no coordination across instances in an ASG.
  *
  * This is not currently suitable for PayPal endpoints because requests come from the backend, not the browser.
  */

case class RateLimitingSettings(maxRequests: Int, interval: FiniteDuration)

class RateLimitingAction(
    val parse: PlayBodyParsers,
    val executionContext: ExecutionContext,
    cloudWatchService: CloudWatchService,
    settings: RateLimitingSettings,
    paymentProvider: PaymentProvider,
    stage: String,
) extends ActionBuilder[Request, AnyContent]
    with ActionFilter[Request]
    with Results
    with Circe
    with StrictLogging
    with JsonUtils {

  override def parser: BodyParser[AnyContent] = parse.defaultBodyParser

  import ResultBody._

  type IpAddress = String

  private val cache: Cache[IpAddress, Int] =
    Scaffeine()
      .recordStats()
      .expireAfter(
        // Start timing from when the ip is first cached, and do not restart the timer after updates
        create = (_: IpAddress, _: Int) => settings.interval,
        update = (_: IpAddress, _: Int, currentDuration: FiniteDuration) => currentDuration,
        read = (_: IpAddress, _: Int, currentDuration: FiniteDuration) => currentDuration,
      )
      .maximumSize(1000)
      .build[IpAddress, Int]()

  def filter[A](request: Request[A]): Future[Option[Result]] = Future.successful {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#Syntax
    request.headers.get("X-Forwarded-For").flatMap(_.split(',').headOption) match {
      case Some(ip) =>
        if (stage == "PROD") {
          cache.getIfPresent(ip) match {
            case Some(count) =>
              if (count >= settings.maxRequests) {
                logger.info(s"Blocking request from $ip for exceeding rate-limit. Request body was: ${request.body}")
                cloudWatchService.put("stripe-rate-limit-exceeded", paymentProvider)
                Some(TooManyRequests(ResultBody.Error("Too many requests")))
              } else {
                cache.put(ip, count + 1)
                None
              }
            case None =>
              cache.put(ip, 1)
              None
          }
        } else {
          None
        }
      case None =>
        logger.info(s"No IP address available, X-Forwarded-For header is: ${request.headers.get("X-Forwarded-For")}")
        None
    }
  }
}
