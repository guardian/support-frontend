package models.identity

import com.gu.identity.play.IdUser
import models.identity.responses.UserSignInDetailsResponse.UserSignInDetails

case class UserWithSignInDetails(user: IdUser, signInDetails: UserSignInDetails)


