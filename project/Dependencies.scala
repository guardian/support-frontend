import sbt._

//noinspection TypeAnnotation
object Dependencies {
  val circeVersion = "0.8.0"
  val awsVersion = "1.11.131"
  val okhttpVersion = "3.9.0"

  val config = "com.typesafe" % "config" % "1.3.1"
  val joda = "org.joda" % "joda-convert" % "1.8.1"
  val cats = "org.typelevel" %% "cats" % "0.9.0"
  val scalaLogging = "com.typesafe.scala-logging" % "scala-logging_2.11" % "3.4.0"
  val logback = "ch.qos.logback" % "logback-classic" % "1.2.3"
  val lambdaLogging = "io.symphonia" % "lambda-logging" % "1.0.0"
  val supportInternationalisation = "com.gu" %% "support-internationalisation" % "0.6"
  val supportModels = "com.gu" %% "support-models" % "0.22"
  val supportConfig = "com.gu" %% "support-config" % "0.12"
  val acquisitionEventProducer = "com.gu" %% "acquisition-event-producer" % "2.0.1"
  val okhttp = "com.squareup.okhttp3" % "okhttp" % okhttpVersion
  val scalaUri = "com.netaporter" %% "scala-uri" % "0.4.16"
  val awsLambdas = "com.amazonaws" % "aws-lambda-java-core" % "1.1.0"
  val awsS3 = "com.amazonaws" % "aws-java-sdk-s3" % awsVersion
  val awsSQS = "com.amazonaws" % "aws-java-sdk-sqs" % awsVersion
  val awsCloudwatch = "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsVersion
  val awsStepFunctions = "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsVersion
  val scalaTest = "org.scalatest" %% "scalatest" % "3.0.1" % "it,test"
  val mokito = "org.mockito" % "mockito-core" % "1.9.5" % "it,test"
  val mockWebserver = "com.squareup.okhttp3" % "mockwebserver" % okhttpVersion % "it,test"
  val circeCore = "io.circe" %% "circe-core" % circeVersion
  val circeGeneric = "io.circe" %% "circe-generic" % circeVersion
  val circeGenericExtras = "io.circe" %% "circe-generic-extras" % circeVersion
  val circeParser = "io.circe" %% "circe-parser" % circeVersion
  val dispatch = "net.databinder.dispatch" %% "dispatch-core" % "0.11.3"
  val stm = "org.scala-stm" %% "scala-stm" % "0.8"
  val sentry = "com.getsentry.raven" % "raven-logback" % "8.0.3"
  val findBugs = "com.google.code.findbugs" % "jsr305" % "3.0.2"
  val guava = "com.google.guava" % "guava" % "23.6-jre"


  val commonDependencies: Seq[ModuleID] = Seq(config, logback, scalaLogging, sentry, lambdaLogging, joda, dispatch,
    supportInternationalisation, supportModels, supportConfig, acquisitionEventProducer, awsCloudwatch, awsS3, awsSQS,
    awsLambdas, awsStepFunctions, okhttp, scalaUri, cats, circeCore, circeGeneric, circeGenericExtras, circeParser, stm, mokito,
    scalaTest, findBugs, guava)
  val monthlyContributionsDependencies: Seq[ModuleID] = Seq(mockWebserver)

}
