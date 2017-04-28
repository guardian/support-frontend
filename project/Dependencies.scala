import sbt._

object Dependencies {
  val circeVersion = "0.7.0"

  val config = "com.typesafe" % "config" % "1.3.1"
  val joda = "org.joda" % "joda-convert" % "1.8.1"
  val scalaTime = "com.github.nscala-time" %% "nscala-time" % "2.16.0" //a wrapper around joda time
  val cats = "org.typelevel" %% "cats" % "0.9.0"
  val scalaLogging = "com.typesafe.scala-logging" % "scala-logging_2.11" % "3.4.0"
  val logback = "ch.qos.logback" % "logback-classic" % "1.2.3"
  val supportInternationalisation = "com.gu" %% "support-internationalisation" % "0.1"
  val okhttp = "com.squareup.okhttp3" % "okhttp" % "3.4.1"
  val scalaUri = "com.netaporter" %% "scala-uri" % "0.4.16"
  val awsLambdas = "com.amazonaws" % "aws-lambda-java-core" % "1.1.0"
  val awsS3 = "com.amazonaws" % "aws-java-sdk-s3" % "1.11.13"
  val awsCloudwatch = "com.amazonaws" % "aws-java-sdk-cloudwatch" % "1.11.95"
  val scalaTest = "org.scalatest" %% "scalatest" % "3.0.1" % "test"
  val mokito = "org.mockito" % "mockito-core" % "1.9.5" % "test"
  val circeCore = "io.circe" %% "circe-core" % circeVersion
  val circeGeneric = "io.circe" %% "circe-generic" % circeVersion
  val circeParser = "io.circe" %% "circe-parser" % circeVersion
  val scalaXml = "org.scala-lang.modules" %% "scala-xml" % "1.0.6"
  val dispatch = "net.databinder.dispatch" %% "dispatch-core" % "0.11.3" //Used for retrying http requests
  val akkaAgent = "com.typesafe.akka" %% "akka-agent" % "2.3.4" //Used by the Salesforce code for handling auth tokens
  val playJson = "com.typesafe.play" %% "play-json" % "2.4.6" //TODO: remove this dependency


  val commonDependencies: Seq[ModuleID] = Seq(config, logback, scalaLogging, akkaAgent, playJson, joda, scalaTime, dispatch, scalaXml, supportInternationalisation, awsCloudwatch, awsS3, awsLambdas, okhttp, scalaUri, cats, circeCore, circeGeneric, circeParser, scalaTest)
  val monthlyContributionsDependencies: Seq[ModuleID] = Seq(mokito, scalaTest)

}