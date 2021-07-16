import LibraryVersions._

scalaVersion := "3.0.0"
scalacOptions += "-source:3.0-migration"

name := "module-aws"

description := "aws services only (sdk v1)"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
