package model

import io.circe.generic.semiauto._
import io.circe.{Encoder, Json, ObjectEncoder}

import scala.reflect._

// It feels like Success and Error could extend a base type.
// However, this would make creating an implicit encoder for ResultBody[A] based on an encoder for A tricky -
// if you want to use Error in isolation e.g. controllers.JsonUtils, then if you don't specify A (seems natural)
// the compiler will infer the type of A is Nothing, which will lead to a compile time error;
// so you'd have to specify an arbitrary type for A for which there is an implicit encoder in scope (seems weird).
// Otherwise you have to start doing stuff like `implicit val nothingEncoder: Encoder[Nothing] = null`,
// which can't be good.
object ResultBody {

  case class Success[A](data: A)

  case class Error(errorMessage: String)

  private def typeDiscriminatorEncoder[A : ClassTag](encoder: ObjectEncoder[A]): ObjectEncoder[A] =
    encoder.mapJsonObject { obj =>
      obj.add("type", Json.fromString(classTag[A].runtimeClass.getSimpleName.toLowerCase))
    }

  implicit def successEncoder[A : Encoder]: Encoder[Success[A]] = typeDiscriminatorEncoder(deriveEncoder[Success[A]])

  implicit val errorEncoder: Encoder[Error] = typeDiscriminatorEncoder(deriveEncoder[Error])
}
