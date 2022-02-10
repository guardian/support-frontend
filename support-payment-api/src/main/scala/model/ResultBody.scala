package model

import io.circe.generic.semiauto._
import io.circe.{Encoder, Json}

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

  case class Error[A](error: A)

  case class RequiresAction[A](data: A)

  private def typeDiscriminatorEncoder[A: ClassTag](encoder: Encoder.AsObject[A]): Encoder.AsObject[A] =
    encoder.mapJsonObject { obj =>
      obj.add("type", Json.fromString(classTag[A].runtimeClass.getSimpleName.toLowerCase))
    }

  implicit def successEncoder[A: Encoder]: Encoder[Success[A]] = typeDiscriminatorEncoder(deriveEncoder[Success[A]])

  implicit def errorEncoderEncoder[A: Encoder]: Encoder[Error[A]] = typeDiscriminatorEncoder(deriveEncoder[Error[A]])

  implicit def requiresActionEncoder[A: Encoder]: Encoder[RequiresAction[A]] = typeDiscriminatorEncoder(
    deriveEncoder[RequiresAction[A]],
  )
}
