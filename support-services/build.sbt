import LibraryVersions.{awsClientVersion, awsClientVersion2}

name := "support-services"

description := "Scala library to provide shared services to Guardian Support projects."

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "com.amazonaws" % "aws-java-sdk-dynamodb" % awsClientVersion,
  "org.scala-stm" %% "scala-stm" % "0.11.0" // only for promotions
)
