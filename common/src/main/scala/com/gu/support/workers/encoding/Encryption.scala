package com.gu.support.workers.encoding

import java.nio.ByteBuffer

import com.amazonaws.services.kms.AWSKMSClientBuilder
import com.amazonaws.services.kms.model._
import com.gu.aws.CredentialsProvider
import com.gu.config.Configuration.awsConfig

object  Encryption {
  private val encryption = if (awsConfig.useEncryption) new AwsEncryptionProvider() else new PassThroughEncryptionProvider()

  def decrypt(data: Array[Byte]): String = encryption.decrypt(data)

  def encrypt(data: String): Array[Byte] = encryption.encrypt(data)
}

class AwsEncryptionProvider extends EncryptionProvider {

  import com.amazonaws.services.kms.model.EncryptRequest

  private val kms = AWSKMSClientBuilder
    .standard()
    .withCredentials(CredentialsProvider)
    .build()

  override def encrypt(data: String): Array[Byte] = {
    val plainText = ByteBuffer.wrap(data.getBytes(utf8))
    val req = new EncryptRequest()
      .withKeyId(awsConfig.encryptionKeyId)
      .withPlaintext(plainText)
    //Encrypt requests work with up to 4KB of data which is plenty
    //for our purposes here. If the amount of data increases significantly
    //we should switch to using Envelope encryption as described here:
    //http://docs.aws.amazon.com/kms/latest/developerguide/workflow.html
    kms.encrypt(req).getCiphertextBlob.array()
  }

  override def decrypt(data: Array[Byte]): String = {
    val byteBuffer = ByteBuffer.wrap(data)
    val req = new DecryptRequest().withCiphertextBlob(byteBuffer)
    new String(kms.decrypt(req).getPlaintext.array(), utf8)
  }
}

class PassThroughEncryptionProvider extends EncryptionProvider {
  override def decrypt(data: Array[Byte]): String = new String(data, utf8)

  override def encrypt(data: String): Array[Byte] = data.getBytes(utf8)
}

sealed trait EncryptionProvider {

  def decrypt(data: Array[Byte]): String

  def encrypt(data: String): Array[Byte]
}

