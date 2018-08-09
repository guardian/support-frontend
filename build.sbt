import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import com.typesafe.sbt.SbtScalariform.ScalariformKeys
import sbt.Keys.{libraryDependencies, resolvers}
import scalariform.formatter.preferences.SpacesAroundMultiImports

scalaVersion := "2.12.4"
organization := "com.gu"
version := "0.1-SNAPSHOT"
scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")

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

lazy val testSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
  scalaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "scala",
  javaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "java",
  testOptions in Test := Seq(Tests.Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest"))
)

lazy val circeVersion = "0.9.3"
lazy val awsVersion = "1.11.331"
lazy val okhttpVersion = "3.10.0"

lazy val root = (project in file("."))
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
  .configs(IntegrationTest)
  .settings(
    name := "support-workers",
    libraryDependencies ++= Seq(
      "com.typesafe" % "config" % "1.3.3",
      "org.joda" % "joda-convert" % "2.0.1",
      "org.typelevel" %% "cats" % "0.9.0",
      "com.typesafe.scala-logging" %% "scala-logging" % "3.9.0",
      "ch.qos.logback" % "logback-classic" % "1.2.3",
      "io.symphonia" % "lambda-logging" % "1.0.1",
      "com.gu" %% "support-internationalisation" % "0.9",
      "com.gu" %% "support-models" % "0.31-SNAPSHOT",
      "com.gu" %% "support-config" % "0.16",
      "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
      "com.netaporter" %% "scala-uri" % "0.4.16",
      "com.amazonaws" % "aws-lambda-java-core" % "1.2.0",
      "com.amazonaws" % "aws-java-sdk-s3" % awsVersion,
      "com.amazonaws" % "aws-java-sdk-sqs" % awsVersion,
      "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsVersion,
      "org.scalatest" %% "scalatest" % "3.0.5" % "it,test",
      "org.mockito" % "mockito-core" % "1.9.5" % "it,test",
      "com.squareup.okhttp3" % "mockwebserver" % okhttpVersion % "it,test",
      "io.circe" %% "circe-core" % circeVersion,
      "io.circe" %% "circe-generic" % circeVersion,
      "io.circe" %% "circe-generic-extras" % circeVersion,
      "io.circe" %% "circe-parser" % circeVersion,
      "net.databinder.dispatch" %% "dispatch-core" % "0.13.3",
      "org.scala-stm" %% "scala-stm" % "0.8",
      "io.sentry" % "sentry-logback" % "1.7.4",
      "com.google.code.findbugs" % "jsr305" % "3.0.2"
    ),
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
      case x if x.endsWith("io.netty.versions.properties") => MergeStrategy.first
      case y =>
        val oldStrategy = (assemblyMergeStrategy in assembly).value
        oldStrategy(y)
    },
    resolvers ++= Seq(Resolver.sonatypeRepo("releases"), Resolver.bintrayRepo("guardian", "ophan"))
  )
  .settings(scalaStyleSettings: _*)
  .settings(testSettings: _*)



