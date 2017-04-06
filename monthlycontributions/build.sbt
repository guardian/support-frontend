organization  := "com.gu"
description   := "AWS Lambdas providing implementations of the Monthly Contribution supporter flow for orchestration by step function"
scalacOptions += "-deprecation"
scalaVersion  := "2.11.8"
scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")
name := "guardian-support-monthly-contributions-lambdas"

lazy val root = (project in file(".")).enablePlugins(JavaAppPackaging, RiffRaffArtifact)

libraryDependencies ++= Seq(
  "org.joda" % "joda-convert" % "1.8.1",
  "org.typelevel" %% "cats" % "0.6.1",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.4.0",
  "ch.qos.logback" %  "logback-classic" % "1.1.7",
  "com.amazonaws" % "aws-lambda-java-core" % "1.1.0",
  "com.amazonaws" % "aws-java-sdk-s3" % "1.11.13",
  "org.scalatest" %% "scalatest" % "2.2.5" % "test"
)

topLevelDirectory in Universal := None
packageName in Universal := normalizedName.value

def env(key: String): Option[String] = Option(System.getenv(key))

riffRaffPackageName := "guardian-support-monthly-contributions-lambdas"
riffRaffPackageType := (packageBin in Universal).value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := s"Membership::${name.value}"
riffRaffManifestVcsUrl := "git@github.com:guardian/support-workers.git"
riffRaffManifestBranch := env("BRANCH_NAME").getOrElse("unknown_branch")
riffRaffBuildIdentifier := env("BUILD_NUMBER").getOrElse("DEV")

assemblySettings
