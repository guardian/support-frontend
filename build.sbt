name := "payment-api"

version := "0.1"
scalaVersion := "2.12.4"
scalacOptions ++= Seq(
  "-Ypartial-unification",
  "-Ywarn-unused:imports"
)

addCompilerPlugin("org.spire-math" %% "kind-projector" % "0.9.4")
addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

val circeVersion = "0.9.1"

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.amazonaws" % "aws-java-sdk-ssm" % "1.11.261",
  "com.beachape" %% "enumeratum" % "1.5.12",
  "com.beachape" %% "enumeratum-circe" % "1.5.12",
  "com.dripower" %% "play-circe" % "2609.0",
  "com.github.mpilquist" %% "simulacrum" % "0.11.0",
  "com.stripe" % "stripe-java" % "5.28.0",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.playframework.anorm" %% "anorm" % "2.6.0",
  "org.postgresql" % "postgresql" % "42.2.1",
  "org.scalatest" %% "scalatest" % "3.0.4" % "test",
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % "test",
  "org.mockito" % "mockito-all" % "1.10.19" % "test",
  "org.typelevel" %% "cats-core" % "0.9.0",
  "com.paypal.sdk" % "rest-api-sdk" % "1.13.0" exclude("org.apache.logging.log4j", "log4j-slf4j-impl"),
  "com.gu" %% "support-internationalisation" % "0.9",
  "com.gu" %% "ophan-event-model" % "0.0.3",
  "com.gu" %% "fezziwig" % "0.6" excludeAll ExclusionRule(organization = "com.twitter"),
  akkaHttpServer, // or use nettyServer for Netty
  logback, // add Play logging support
  jdbc,
  ws
)

lazy val TeamCityTest = config("teamcity").extend(Test)

lazy val root = (project in file("."))
  .configs(TeamCityTest)
  .settings(inConfig(TeamCityTest)(Defaults.testTasks))
  // Allows us to not run tests which require membership credentials in TeamCity - teamcity:test
  // Stop gap until we decide how to handle integration tests.
  .settings(testOptions in TeamCityTest += Tests.Argument("-l", "tags.RequiresMembershipCredentials"))

enablePlugins(SystemdPlugin, PlayService, RoutesCompiler, RiffRaffArtifact, JDebPackaging)

packageName in Debian := name.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:payment-api"
riffRaffPackageType := (packageBin in Debian).value
riffRaffArtifactResources += (file("resources/cloud-formation.yaml"), "cfn/cloud-formation.yaml")