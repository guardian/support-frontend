object PostcodeSplitter extends App {


  val source = "BR1 2 BR1 3 BR1 4 BR1 5 BR2 0 BR2 6 BR2 7 BR2 8 BR2 9 BR3 1 BR3 3 BR3 4 BR3 5 BR3 6 BR4 0 BR4 9 BR5 1 BR5 2 BR5 3 BR5 4 BR6 0 BR6 6 BR6 7 BR6 8 BR6 9 BR7 5 BR7 6"

  val recombined = source.split("\\s+").sliding(2).map { twoPart =>
    twoPart.mkString("")
  }

  println(recombined.mkString(", "))
}
