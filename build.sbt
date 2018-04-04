import com.typesafe.sbt.SbtScalariform.ScalariformKeys
import sbt.Keys.{libraryDependencies, resolvers}

import scalariform.formatter.preferences.SpacesAroundMultiImports

scalaVersion := "2.12.4"

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val scalaStyleSettings = Seq(
  scalastyleFailOnError := true,
  testScalastyle := org.scalastyle.sbt.ScalastylePlugin.scalastyle.in(Compile).toTask("").value,
  (test in Test) := ((test in Test) dependsOn testScalastyle).value,
  (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
  (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated,
  ScalariformKeys.preferences := ScalariformKeys.preferences.value
    .setPreference(SpacesAroundMultiImports, false)
)

lazy val root =
  project.in(file("."))
    .settings(
      name := "support-workers"
    )
    .aggregate(common, `monthly-contributions`)

lazy val circeVersion = "0.8.0"
lazy val awsVersion = "1.11.161"
lazy val okhttpVersion = "3.9.0"

lazy val common = project
  .configs(IntegrationTest)
  .settings(
    name := "guardian-support-common",
    description := "Common code for the support-workers project",
    libraryDependencies ++= Seq(
      "com.typesafe" % "config" % "1.3.1",
      "org.joda" % "joda-convert" % "1.8.1",
      "org.typelevel" %% "cats" % "0.9.0",
      "com.typesafe.scala-logging" % "scala-logging_2.12" % "3.5.0",
      "ch.qos.logback" % "logback-classic" % "1.2.3",
      "io.symphonia" % "lambda-logging" % "1.0.0",
      "com.gu" %% "support-internationalisation" % "0.9",
      "com.gu" %% "support-models" % "0.23",
      "com.gu" %% "support-config" % "0.16",
      "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
      "com.netaporter" %% "scala-uri" % "0.4.16",
      "com.amazonaws" % "aws-lambda-java-core" % "1.1.0",
      "com.amazonaws" % "aws-java-sdk-s3" % awsVersion,
      "com.amazonaws" % "aws-java-sdk-sqs" % awsVersion,
      "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsVersion,
      "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsVersion,
      "org.scalatest" %% "scalatest" % "3.0.1" % "it,test",
      "org.mockito" % "mockito-core" % "1.9.5" % "it,test",
      "io.circe" %% "circe-core" % circeVersion,
      "io.circe" %% "circe-generic" % circeVersion,
      "io.circe" %% "circe-generic-extras" % circeVersion,
      "io.circe" %% "circe-parser" % circeVersion,
      "net.databinder.dispatch" %% "dispatch-core" % "0.12.3",
      "org.scala-stm" %% "scala-stm" % "0.8",
      "com.getsentry.raven" % "raven-logback" % "8.0.3",
      "com.google.code.findbugs" % "jsr305" % "3.0.2",
      "com.google.guava" % "guava" % "23.6-jre"
    ),
    resolvers ++= Seq(Resolver.sonatypeRepo("releases"), Resolver.bintrayRepo("guardian", "ophan")),
    scalaStyleSettings
  )
  .settings(Settings.testSettings: _*)
  .settings(Settings.shared: _*)

lazy val `monthly-contributions` = project
  .in(file("monthly-contributions"))
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
  .configs(IntegrationTest)
  .settings(
    name := "monthly-contributions",
    description := "AWS Lambdas providing implementations of the Monthly Contribution supporter flow for orchestration by step function",
    riffRaffPackageType := assembly.value,
    riffRaffManifestProjectName := s"support:${name.value}",
    riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch"),
    riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV"),
    riffRaffManifestVcsUrl := "git@github.com/guardian/support-workers.git",
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),
    riffRaffArtifactResources += (file("cloud-formation/target/cfn.yaml"), "cfn/cfn.yaml"),
    assemblyJarName := s"${name.value}.jar",
    assemblyMergeStrategy in assembly := {
      case PathList("models", xs@_*) => MergeStrategy.discard
      case x =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(x)
    },
    libraryDependencies ++= Seq(
      "com.squareup.okhttp3" % "mockwebserver" % okhttpVersion % "it,test"
    ),
    scalaStyleSettings
  )
  .settings(Settings.testSettings: _*)
  .settings(Settings.shared: _*)
  .dependsOn(common % "compile->compile;test->test;it->test")
