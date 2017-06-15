package services

import com.gu.identity.cookie.IdentityKeys
import com.gu.identity.play.AccessCredentials.{Cookies, Token}
import com.gu.identity.play.AuthenticatedIdUser._

class AuthenticationService(override val identityKeys: IdentityKeys) extends com.gu.identity.play.AuthenticationService {
  override lazy val authenticatedIdUserProvider: Provider =
    Cookies.authProvider(identityKeys).withDisplayNameProvider(Token.authProvider(identityKeys, "membership"))
}
