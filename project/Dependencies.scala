import sbt._

object Dependencies {
  val circeVersion = "0.7.0"
  val joda = "org.joda" % "joda-convert" % "1.8.1"
  val cats = "org.typelevel" %% "cats" % "0.6.1"
  val scalaLogging = "com.typesafe.scala-logging" % "scala-logging_2.11" % "3.4.0"
  val okhttp = "com.squareup.okhttp3" % "okhttp" % "3.4.1"
  val awsLambdas = "com.amazonaws" % "aws-lambda-java-core" % "1.1.0"
  val awsS3 = "com.amazonaws" % "aws-java-sdk-s3" % "1.11.13"
  val awsCloudwatch = "com.amazonaws" % "aws-java-sdk-cloudwatch" % "1.11.95"
  val scalaTest = "org.scalatest" %% "scalatest" % "3.0.1" % "test"
  val mokito = "org.mockito" % "mockito-core" % "1.9.5" % "test"
  val circeCore = "io.circe" %% "circe-core" % circeVersion
  val circeGeneric = "io.circe" %% "circe-generic" % circeVersion
  val circeParser = "io.circe" %% "circe-parser" % circeVersion


  val commonDependencies: Seq[ModuleID] = Seq(scalaLogging, awsCloudwatch, awsLambdas, okhttp, cats, circeCore, circeGeneric, circeParser)
  val monthlyContributionsDependencies: Seq[ModuleID] = Seq(scalaLogging, awsS3, scalaTest, mokito)

}