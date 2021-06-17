import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport._

name := "acquisitions-firehose-transformer"

organization := "com.gu"

description:= "A Firehose transformation lambda for serialising the acquisitions event stream to csv"

version := "0.1"

scalaVersion := "2.12.8"

val circeVersion = "0.10.0"

scalacOptions ++= Seq(
  "-deprecation",
  "-encoding", "UTF-8",
  "-target:jvm-1.8",
  "-Ywarn-dead-code"
)

resolvers += Resolver.sonatypeRepo("releases")

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.0",
  "com.amazonaws" % "aws-lambda-java-events" % "2.2.4",
  "ch.qos.logback" % "logback-classic" % "1.1.7",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.5.0",
  "com.gu" %% "thrift-serializer" % "3.0.0",
  "com.gu" %% "ophan-event-model" % "0.0.17",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "org.scalatest" %% "scalatest" % "3.0.0" % "test"
)


scalacOptions ++= Seq("-Xfatal-warnings")

enablePlugins(JavaAppPackaging, RiffRaffArtifact)

topLevelDirectory in Universal := None
packageName in Universal := normalizedName.value

riffRaffPackageType := (packageBin in Universal).value
riffRaffManifestProjectName := s"Contributions::${name.value}"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
