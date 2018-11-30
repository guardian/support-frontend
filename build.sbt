import sbtrelease.ReleaseStateTransformations._

name := "support-services"

organization := "com.gu"

scalaVersion := "2.12.7"

val awsClientVersion = "1.11.226"
lazy val circeVersion = "0.10.1"

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "com.typesafe" % "config" % "1.3.2",
  "com.amazonaws" % "aws-java-sdk-dynamodb" % awsClientVersion,
  "org.typelevel" %% "cats-core" % "1.4.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "com.gu" %% "support-internationalisation" % "0.9",
  "com.gu" %% "support-models" % "0.39-SNAPSHOT",
  "com.gu" %% "support-config" % "0.17-SNAPSHOT",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test"
)

releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  ReleaseStep(action = Command.process("publishSigned", _)),
  setNextVersion,
  commitNextVersion,
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _)),
  pushChanges
)
