name := "support-frontend"

version := "1.0-SNAPSHOT"

packageSummary := "Support Play APP"

scalaVersion := "2.12.6"

import scala.sys.process._

def env(key: String, default: String): String = Option(System.getenv(key)).getOrElse(default)

def commitId(): String = try {
  "git rev-parse HEAD".!!.trim
} catch {
  case _: Exception => "unknown"
}

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val SeleniumTest = config("selenium") extend(Test)

def seleniumTestFilter(name: String): Boolean = name startsWith "selenium"

def unitTestFilter(name: String): Boolean = !seleniumTestFilter(name)

testOptions in SeleniumTest := Seq(Tests.Filter(seleniumTestFilter))

testOptions in Test := Seq(Tests.Filter(unitTestFilter))

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging)
  .configs(SeleniumTest)
  .settings(
  inConfig(SeleniumTest)(Defaults.testTasks),
  buildInfoKeys := Seq[BuildInfoKey](
    name,
    BuildInfoKey.constant("buildNumber", env("BUILD_NUMBER", "DEV")),
    BuildInfoKey.constant("buildTime", System.currentTimeMillis),
    BuildInfoKey.constant("gitCommitId", Option(System.getenv("BUILD_VCS_NUMBER")) getOrElse commitId())
  ),
  buildInfoPackage := "app",
  buildInfoOptions += BuildInfoOption.ToMap,
  scalastyleFailOnError := true,
  testScalastyle := scalastyle.in(Compile).toTask("").value,
  (test in Test) := ((test in Test) dependsOn testScalastyle).value,
  (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
  (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated
)

val circeVersion = "0.9.1"

resolvers ++= Seq(Resolver.sonatypeRepo("releases"), Resolver.bintrayRepo("guardian", "ophan"))

val awsVersion = "1.11.221"
libraryDependencies ++= Seq(
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test,
  "org.mockito" % "mockito-core" % "2.11.0" % Test,
  "io.sentry" % "sentry-logback" % "1.7.5",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "com.amazonaws" % "aws-java-sdk-kms" % awsVersion,
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsVersion,
  "com.amazonaws" % "aws-java-sdk-sts" % awsVersion,
  "org.typelevel" %% "cats-core" % "1.0.1",
  "com.dripower" %% "play-circe" % "2609.1",
  "com.gu" %% "support-models" % "0.30",
  "com.gu" %% "support-config" % "0.16",
  "com.gu" %% "fezziwig" % "0.8",
  "com.typesafe.akka" %% "akka-agent" % "2.5.14",
  "com.gu" %% "support-internationalisation" % "0.9",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "joda-time" % "joda-time" % "2.9.9",
  "com.gu.identity" %% "identity-play-auth" % "2.5",
  "com.gu" %% "identity-test-users" % "0.6",
  "com.google.guava" % "guava" % "25.0-jre",
  "com.netaporter" %% "scala-uri" % "0.4.16",
  "com.gu" %% "play-googleauth" % "0.7.6",
  "io.github.bonigarcia" % "webdrivermanager" % "2.1.0" % "test",
  "org.seleniumhq.selenium" % "selenium-java" % "3.8.1" % "test",
  "com.squareup.okhttp3" % "okhttp" % "3.9.0",
  "com.gocardless" % "gocardless-pro" % "2.8.0",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % "2.8.11.1",
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
import scalariform.formatter.preferences.{DanglingCloseParenthesis, DoubleIndentConstructorArguments, SpacesAroundMultiImports}
import scalariform.formatter.preferences.Force

ScalariformKeys.preferences := ScalariformKeys.preferences.value
  .setPreference(SpacesAroundMultiImports, false)
  .setPreference(DoubleIndentConstructorArguments, true)
  .setPreference(DanglingCloseParenthesis, Force)

excludeFilter in scalariformFormat := (excludeFilter in scalariformFormat).value ||
  "Routes.scala" ||
  "ReverseRoutes.scala" ||
  "JavaScriptReverseRoutes.scala" ||
  "RoutesPrefix.scala"

addCommandAlias("devrun", "run 9210") // Chosen to not clash with other Guardian projects - we can't all use the Play default of 9000!
