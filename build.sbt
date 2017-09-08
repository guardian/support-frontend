name := "support-frontend"

version := "1.0-SNAPSHOT"

packageSummary := "Support Play APP"

scalaVersion := "2.11.8"

def env(key: String, default: String): String = Option(System.getenv(key)).getOrElse(default)

def commitId(): String = try {
  "git rev-parse HEAD".!!.trim
} catch {
  case _: Exception => "unknown"
}

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val root = (project in file(".")).enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging).settings(
  buildInfoKeys := Seq[BuildInfoKey](
    name,
    BuildInfoKey.constant("buildNumber", env("BUILD_NUMBER", "DEV")),
    BuildInfoKey.constant("buildTime", System.currentTimeMillis),
    BuildInfoKey.constant("gitCommitId", Option(System.getenv("BUILD_VCS_NUMBER")) getOrElse commitId())
  ),
  buildInfoPackage := "app",
  buildInfoOptions += BuildInfoOption.ToMap,
  scalastyleFailOnError := true,
  testScalastyle := org.scalastyle.sbt.ScalastylePlugin.scalastyle.in(Compile).toTask("").value,
  (test in Test) := ((test in Test) dependsOn testScalastyle).value,
  (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
  (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated
)

val circeVersion = "0.8.0"

resolvers += "Bintary JCenter" at "http://jcenter.bintray.com"

libraryDependencies ++= Seq(
  "org.scalatestplus.play" %% "scalatestplus-play" % "2.0.0" % Test,
  "org.mockito" % "mockito-core" % "2.7.22" % Test,
  "com.getsentry.raven" % "raven-logback" % "8.0.3",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.5.0",
  "com.amazonaws" % "aws-java-sdk-kms" % "1.11.128",
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % "1.11.128",
  "org.typelevel" %% "cats" % "0.9.0",
  "play-circe" %% "play-circe" % "2.6-0.8.0",
  "com.gu" %% "support-models" % "0.10",
  "com.gu" %% "support-config" % "0.7",
  "com.amazonaws" % "aws-java-sdk-sts" % "1.11.128",
  "com.typesafe.akka" %% "akka-agent" % "2.4.12",
  "com.gu" %% "support-internationalisation" % "0.2",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "joda-time" % "joda-time" % "2.9.9",
  "com.gu.identity" %% "identity-play-auth" % "2.0",
  "com.gu" %% "identity-test-users" % "0.6",
  "com.google.guava" % "guava" % "22.0",
  "com.netaporter" %% "scala-uri" % "0.4.16",
  "com.gu" %% "play-googleauth" % "0.7.0",
  "io.github.bonigarcia" % "webdrivermanager" % "1.4.10" % "test",
  "org.seleniumhq.selenium" % "selenium-java" % "3.0.1" % "test",
  "com.squareup.okhttp3" % "okhttp" % "3.8.1",
  filters,
  ws
)

sources in(Compile, doc) := Seq.empty

publishArtifact in(Compile, packageDoc) := false

enablePlugins(SystemdPlugin)

debianPackageDependencies := Seq("openjdk-8-jre-headless")

packageSummary := "Support Frontend Play App"
packageDescription := """Frontend for the new supporter platform"""
maintainer := "Membership <membership.dev@theguardian.com>"

riffRaffPackageType := (packageBin in Debian).value
riffRaffManifestProjectName := "support:frontend"
riffRaffPackageName := "frontend"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("cloud-formation/cfn.yaml"), "cfn/cfn.yaml")

javaOptions in Universal ++= Seq(
  "-Dpidfile.path=/dev/null",
  "-J-XX:MaxRAMFraction=2",
  "-J-XX:InitialRAMFraction=2",
  "-J-XX:MaxMetaspaceSize=500m",
  "-J-XX:+PrintGCDetails",
  "-J-XX:+PrintGCDateStamps",
  s"-J-Xloggc:/var/log/${packageName.value}/gc.log"
)

javaOptions in Test += "-Dconfig.file=test/selenium/conf/selenium-test.conf"

import com.typesafe.sbt.SbtScalariform.ScalariformKeys
import scalariform.formatter.preferences.SpacesAroundMultiImports

ScalariformKeys.preferences := ScalariformKeys.preferences.value
  .setPreference(SpacesAroundMultiImports, false)

excludeFilter in scalariformFormat := (excludeFilter in scalariformFormat).value ||
  "Routes.scala" ||
  "ReverseRoutes.scala" ||
  "JavaScriptReverseRoutes.scala" ||
  "RoutesPrefix.scala"

addCommandAlias("devrun", "run 9210") // Chosen to not clash with other Guardian projects - we can't all use the Play default of 9000!
addCommandAlias("fast-test", "test-only -- -l Selenium")
addCommandAlias("selenium-test", "test-only -- -n Selenium")