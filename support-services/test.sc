import com.gu.support.catalog.DigitalPack

//println(DigitalPack.ratePlans.groupBy(_.productOptions).map(_.))

val x = Map("test" -> 1, "blah" -> 2)

val y = x.map{
  case(k, v) => {
    (k, Map(k -> (v + 1)))
  }
}

y +

List(1,2,3) ++ List(4,5,6)








