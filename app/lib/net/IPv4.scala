package lib.net

import PartialFunction.condOpt

object Octet {
  def unapply(s: String): Option[Int] = util.Try(s.toInt).toOption.filter(n => n >= 0 && n <= 255)
}

case class IPv4(underlying: Int) extends AnyVal {
  import IPv4._

  def publicIpAddress: Boolean = !privateIpAddress

  def privateIpAddress: Boolean = {
    (underlying & netmaskClassA) == privatePrefixClassA ||
      (underlying & netmaskClassB) == privatePrefixClassB ||
      (underlying & netmaskClassC) == privatePrefixClassC
  }
}

object IPv4 {

  val netmaskClassA = 0xff000000
  val netmaskClassB = 0xfff00000
  val netmaskClassC = 0xffff0000

  val privatePrefixClassA = 10 << 24
  val privatePrefixClassB = 172 << 24 | 16 << 16
  val privatePrefixClassC = 192 << 24 | 168 << 16

  def fromString(s: String): Option[IPv4] = condOpt(s.split('.').toList) {
    case Octet(a) :: Octet(b) :: Octet(c) :: Octet(d) :: Nil =>
      IPv4(a << 24 | b << 16 | c << 8 | d)
  }

  def publicIpAddress(ip: String): Boolean =
    IPv4.fromString(ip).exists(_.publicIpAddress)
}