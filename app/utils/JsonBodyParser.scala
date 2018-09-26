package utils

import com.gu.identity.model.LiftJsonConfig
import models.identity.responses.IdentityApiResponseError
import monitoring.SafeLogger
import monitoring.SafeLogger._
import net.liftweb.json.{Formats, MappingException, Serializer, TypeInfo}
import net.liftweb.json.JsonAST.{JNothing, JString, JValue}
import net.liftweb.json.JsonParser._
import play.api.libs.ws.WSResponse
import com.gu.identity.model.{LiftJsonConfig, Error => IdApiError}

object JsonBodyParser {
  implicit val formats = LiftJsonConfig.formats

  def extract[T](extractJsonObj: JValue => JValue = identity)(response: WSResponse)(implicit successType: Manifest[T]): Either[IdentityApiResponseError, T] = {
    try {
      response.status match {
        case statusCode if statusCode >= 200 && statusCode < 300 =>
          Right(extractJsonObj(parse(response.body)).extract[T])

        case 502 =>
          SafeLogger.error(scrub"API unavailable, 502")
          Left(IdentityApiResponseError("Bad gateway", "The server was not available", 502))

        case 503 =>
          SafeLogger.error(scrub"API unavailable, 503")
          Left(IdentityApiResponseError("Service unavailable", "The service was not available", 503))

        case 504 =>
          SafeLogger.error(scrub"API unavailable, 504")
          Left(IdentityApiResponseError("Gateway timeout", "The service did not respond", 504))

        case statusCode =>
          SafeLogger.error(scrub"Unknown error, $statusCode")
          Left(IdentityApiResponseError("Unknown Error", parse(response.body).toString, statusCode))

      }
    } catch {
      case e: MappingException => {
        SafeLogger.error(scrub"JSON mapping exception", e)
        Left(IdentityApiResponseError("JSON mapping exception", "The api returned some json that did not match the expected format, 500"))
      }
      case e: ParseException => {
        SafeLogger.error(scrub"JSON parse exception", e)
        Left(IdentityApiResponseError("JSON parsing exception", "The api returned a response that was not valid json:" + e.getMessage))
      }
    }
  }
  def jsonField(field: String)(json: JValue): JValue = json \ field
}
