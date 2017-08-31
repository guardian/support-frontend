import io.circe.{Encoder, Json}
import ophan.thrift.event.AbTestInfo

package object instances {
  object abTestInfo {
    implicit val encodeAbTestInfo: Encoder[AbTestInfo] = new Encoder[AbTestInfo] {
      import io.circe.syntax._

      override def apply(testInfo: AbTestInfo): Json = {
        testInfo.tests.map(t => t.name -> Map("variantName" -> t.variant)).toMap.asJson
      }
    }
  }
}
