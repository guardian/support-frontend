package services

import com.gu.aws.CredentialsProvider
import software.amazon.awssdk.services.sts.StsClient
import software.amazon.awssdk.services.sts.model.GetCallerIdentityRequest

package object aws {
  val ProfileName = "membership"

  lazy val AccountId: String = {
    val stsClient = StsClient
      .builder()
      .credentialsProvider(CredentialsProvider)
      .build()
    val request = GetCallerIdentityRequest.builder().build()
    val response = stsClient.getCallerIdentity(request)
    response.account()
  }
}
