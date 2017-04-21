import sbt.Keys.{libraryDependencies, scalacOptions}

organization := "com.gu"
scalacOptions += "-deprecation"
scalaVersion := "2.11.8"
scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")

val circeVersion = "0.7.0"

val commonDependencies = Seq(
  "org.joda" % "joda-convert" % "1.8.1",
  "org.typelevel" %% "cats" % "0.6.1",
  "com.typesafe.scala-logging" % "scala-logging_2.11" % "3.4.0",
  "com.squareup.okhttp3" % "okhttp" % "3.4.1",
  "ch.qos.logback" % "logback-classic" % "1.1.7",
  "com.amazonaws" % "aws-lambda-java-core" % "1.1.0",
  "com.amazonaws" % "aws-java-sdk-s3" % "1.11.13",
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % "1.11.95",
  "org.scalatest" %% "scalatest" % "3.0.1" % "test",
  "org.mockito" % "mockito-core" % "1.9.5" % "test",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion
)

lazy val supportworkers =
  project.in(file("."))
    .aggregate(common, monthlycontributions)

lazy val common = project
  .settings(
    name := "guardian-support-common",
    description := "Common code for the support-workers project",
    scalaVersion := "2.11.8",
    libraryDependencies ++= commonDependencies
  )

lazy val monthlycontributions = project
  .settings(
    name := "guardian-support-monthly-contributions-lambdas",
    description := "AWS Lambdas providing implementations of the Monthly Contribution supporter flow for orchestration by step function",
    scalaVersion := "2.11.8",
    riffRaffPackageName := "guardian-support-monthly-contributions-lambdas",
    riffRaffPackageType := (packageBin in Universal).value,
    libraryDependencies ++= commonDependencies

  )
  .dependsOn(common)
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
