name := "acquisitions-firehose-transformer"

organization := "com.gu"

description:= "A Firehose transformation lambda for serialising the acquisitions event stream to csv"

version := "0.1"

scalaVersion := "2.12.8"

val circeVersion = "0.10.0"

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

assemblyJarName := s"$name.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := s"support:lambdas:$name"
riffRaffArtifactResources += (file(s"support-lambdas/$name/cfn.yaml"), "cfn/cfn.yaml")
riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch")
riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV")
