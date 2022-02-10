package services

import org.scalatest.matchers.{MatchResult, Matcher}

import services.IdentityClient.ApiError

trait IdentityClientErrorMatchers {

  class IsAnApiError(errorType: String, p: ApiError => Boolean) extends Matcher[IdentityClient.ContextualError] {
    override def apply(left: IdentityClient.ContextualError): MatchResult = {
      MatchResult(
        left match {
          case IdentityClient.ContextualError(err: ApiError, _) if p(err) => true
          case _ => false
        },
        s"Error returned was not an API error of type: $errorType",
        s"Error returned was an API error of type: $errorType",
      )
    }
  }

  val beANotFoundApiError = new IsAnApiError("Not found", _.isNotFound)

  val beAnEmailInUseApiError = new IsAnApiError("Email in use", _.isEmailInUse)
}
