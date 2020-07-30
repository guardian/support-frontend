import LibraryVersions.{awsClientVersion, catsVersion, circeVersion, okhttpVersion}

name := "support-services"

description := "Scala library to provide shared services to Guardian Support projects."

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % "2.13.26",
  "org.scala-lang.modules" %% "scala-java8-compat" % "0.9.1",
  "com.amazonaws" % "aws-java-sdk-dynamodb" % awsClientVersion,
  "org.scala-stm" %% "scala-stm" % "0.8", // only for promotions
)
