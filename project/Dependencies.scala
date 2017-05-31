import sbt._

object Dependencies {
  val circeVersion = "0.7.0"
  val awsVersion = "1.11.131"
  val config = "com.typesafe" % "config" % "1.3.1"
  val joda = "org.joda" % "joda-convert" % "1.8.1"
  val cats = "org.typelevel" %% "cats" % "0.9.0"
  val scalaLogging = "com.typesafe.scala-logging" % "scala-logging_2.11" % "3.4.0"
  val logback = "ch.qos.logback" % "logback-classic" % "1.2.3"
  val lambdaLogging = "io.symphonia" % "lambda-logging" % "1.0.0"
  val supportInternationalisation = "com.gu" %% "support-internationalisation" % "0.1"
  val supportModels = "com.gu" %% "support-models" % "0.1"
  val okhttp = "com.squareup.okhttp3" % "okhttp" % "3.4.1"
  val scalaUri = "com.netaporter" %% "scala-uri" % "0.4.16"
  val awsLambdas = "com.amazonaws" % "aws-lambda-java-core" % "1.1.0"
  val awsS3 = "com.amazonaws" % "aws-java-sdk-s3" % awsVersion
  val awsSQS = "com.amazonaws" % "aws-java-sdk-sqs" % awsVersion
  val awsCloudwatch = "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsVersion
  val scalaTest = "org.scalatest" %% "scalatest" % "3.0.1" % "test"
  val mokito = "org.mockito" % "mockito-core" % "1.9.5" % "test"
  val circeCore = "io.circe" %% "circe-core" % circeVersion
  val circeGeneric = "io.circe" %% "circe-generic" % circeVersion
  val circeGenericExtras = "io.circe" %% "circe-generic-extras" % circeVersion
  val circeParser = "io.circe" %% "circe-parser" % circeVersion
  val dispatch = "net.databinder.dispatch" %% "dispatch-core" % "0.11.3"
  val stm = "org.scala-stm" %% "scala-stm" % "0.8"
  val sentry = "com.getsentry.raven" % "raven-logback" % "8.0.3"

  val commonDependencies: Seq[ModuleID] = Seq(config, logback, scalaLogging, lambdaLogging, joda, dispatch,
    supportInternationalisation, supportModels, awsCloudwatch, awsS3, awsSQS, awsLambdas, okhttp, scalaUri, cats, circeCore,
    circeGeneric, circeGenericExtras, circeParser, stm, scalaTest)
  val monthlyContributionsDependencies: Seq[ModuleID] = Seq(mokito, scalaTest)

}
