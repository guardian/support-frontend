package services

import com.amazonaws.auth.profile.ProfileCredentialsProvider
import com.amazonaws.auth.{AWSCredentialsProviderChain, InstanceProfileCredentialsProvider}
import com.amazonaws.services.securitytoken.AWSSecurityTokenServiceClientBuilder
import com.amazonaws.services.securitytoken.model.GetCallerIdentityRequest

package object aws {
  val ProfileName = "membership"

  lazy val CredentialsProvider = new AWSCredentialsProviderChain(
    new ProfileCredentialsProvider(ProfileName),
    new InstanceProfileCredentialsProvider(false),
  )

  lazy val AccountId: String = {
    val stsService = AWSSecurityTokenServiceClientBuilder.standard.withCredentials(CredentialsProvider).build
    val callerIdentity = stsService.getCallerIdentity(new GetCallerIdentityRequest())
    callerIdentity.getAccount
  }
}
