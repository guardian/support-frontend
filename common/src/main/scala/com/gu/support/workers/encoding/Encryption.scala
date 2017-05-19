package com.gu.support.workers.encoding

import java.io.InputStream
import java.nio.ByteBuffer

import com.amazonaws.services.kms.AWSKMSClientBuilder
import com.amazonaws.services.kms.model.DecryptRequest
import com.gu.aws.CredentialsProvider
import com.gu.config.Configuration.awsConfig

import scala.reflect.io.Streamable

object Encryption {
  val encryption = if (awsConfig.useEncryption) new AwsEncryptionProvider() else new PassThroughEncryptionProvider()

  def decrypt(is: InputStream): String = encryption.decrypt(Streamable.bytes(is))

  def encrypt(data: String): Array[Byte] = encryption.encrypt(data)
}

class AwsEncryptionProvider extends EncryptionProvider {

  import com.amazonaws.services.kms.model.EncryptRequest

  val kms = AWSKMSClientBuilder
    .standard()
    .withCredentials(CredentialsProvider)
    .build()

  override def encrypt(data: String): Array[Byte] = {
    val plainText = ByteBuffer.wrap(data.getBytes(utf8))
    val req = new EncryptRequest()
      .withKeyId(awsConfig.encryptionKeyId)
      .withPlaintext(plainText)
    kms.encrypt(req).getCiphertextBlob.array()
  }

  override def decrypt(data: Array[Byte]): String = {
    val byteBuffer = ByteBuffer.wrap(data)
    val req2 = new DecryptRequest().withCiphertextBlob(byteBuffer)
    new String(kms.decrypt(req2).getPlaintext.array(), utf8)
  }
}

class PassThroughEncryptionProvider extends EncryptionProvider {
  override def decrypt(data: Array[Byte]): String = new String(data, utf8)

  override def encrypt(data: String): Array[Byte] = data.getBytes(utf8)
}

sealed trait EncryptionProvider {
  val utf8 = "UTF-8"

  def decrypt(data: Array[Byte]): String

  def encrypt(data: String): Array[Byte]
}
