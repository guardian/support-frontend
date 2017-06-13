package lib.net

import org.scalatest.WordSpec
import org.scalatest.Matchers._

class IPv4Test extends WordSpec {
  "identifying public/private ip addresses" should {

    "correctly identify private addresses" in {
      val privateAddresses = List(
        "10.0.0.0",
        "10.255.255.255",
        "172.16.0.0",
        "172.31.255.255",
        "192.168.0.0",
        "192.168.255.255"
      )

      all(privateAddresses.map(IPv4.publicIpAddress)) should equal(false)
    }

    "correctly identify public addresses" in {
      val publicAddresses = List(
        "9.255.255.255",
        "11.0.0.0",
        "172.15.255.255",
        "172.32.0.0",
        "192.167.255.255",
        "192.169.0.0"
      )

      all(publicAddresses.map(IPv4.publicIpAddress)) should equal(true)
    }
  }
}
