package com.gu.encryption

import com.gu.support.workers.encoding.AwsEncryptionProvider
import com.gu.test.tags.annotations.IntegrationTest
import com.typesafe.scalalogging.LazyLogging
import org.scalatest.{AsyncFlatSpec, Matchers}

@IntegrationTest
class EncryptionSpec extends AsyncFlatSpec with Matchers with LazyLogging {

  "AwsEncryptionProvider" should "be able to round trip some text" in {

    val text = "Some test text"

    val encryption = new AwsEncryptionProvider()

    val encrypted = encryption.encrypt(text)

    val decrypted = encryption.decrypt(encrypted)

    decrypted should be(text)

  }
}
