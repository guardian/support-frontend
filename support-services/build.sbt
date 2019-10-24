import LibraryVersions.{awsClientVersion, catsVersion, circeVersion, okhttpVersion}

name := "support-services"

description := "Scala library to provide shared services to Guardian Support projects."

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-java-sdk-dynamodb" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsClientVersion,
  "org.scala-stm" %% "scala-stm" % "0.8", // only for promotions
)
