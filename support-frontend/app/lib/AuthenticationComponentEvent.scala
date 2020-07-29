package lib

object AuthenticationComponentEvent {
  sealed abstract class ComponentEventId(val id: String)
  case object SigninRedirectForSupporters extends ComponentEventId("signin_redirect_for_supporters")

  def createAuthenticationComponentEventTuple(componentEventId: ComponentEventId): (String, String) = {
    val eventParams = s"componentType=identityauthentication&componentId=${componentEventId.id}"
    "componentEventParams" -> eventParams
  }
}
