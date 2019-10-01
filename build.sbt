name := "payment-api"

version := "0.1"
scalaVersion := "2.12.4"
scalacOptions ++= Seq(
  "-Ypartial-unification",
  "-Ywarn-unused:imports"
)

addCompilerPlugin("org.spire-math" %% "kind-projector" % "0.9.6")
addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

val circeVersion = "0.11.1"
val AWSJavaSDKVersion = "1.11.568"
val jacksonVersion = "2.10.0"
val stripeVersion = "10.12.0" // Supports API version 2019-05-16

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.amazonaws" % "aws-java-sdk-ssm" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-ec2" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % AWSJavaSDKVersion,
  "com.beachape" %% "enumeratum" % "1.5.12",
  "com.beachape" %% "enumeratum-circe" % "1.5.12",
  "com.dripower" %% "play-circe" % "2611.0",
  "com.github.mpilquist" %% "simulacrum" % "0.11.0",
  "com.stripe" % "stripe-java" % stripeVersion,
  "com.gocardless" % "gocardless-pro" % "2.8.0",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.playframework.anorm" %% "anorm" % "2.6.0",
  "org.postgresql" % "postgresql" % "42.2.5",
  "org.scalatest" %% "scalatest" % "3.0.4" % "test",
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % "test",
  "org.mockito" % "mockito-all" % "1.10.19" % "test",
  "org.typelevel" %% "cats-core" % "0.9.0",
  "com.github.blemale" %% "scaffeine" % "3.1.0",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-core" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % jacksonVersion,
  "com.google.guava" % "guava" % "25.0-jre", //-- added explicitly - snyk report avoid logback vulnerability
  "com.paypal.sdk" % "rest-api-sdk" % "1.13.0" exclude("org.apache.logging.log4j", "log4j-slf4j-impl"),
  "com.gu" %% "support-internationalisation" % "0.9",
  "com.gu" %% "support-models" % "0.65",
  "com.gu" %% "ophan-event-model" % "0.0.10",
  "org.apache.thrift" % "libthrift" % "0.12.0",// needed for snyk deps https://app.snyk.io/vuln/SNYK-JAVA-ORGAPACHETHRIFT-173706
  "com.gu" %% "fezziwig" % "1.1" excludeAll ExclusionRule(organization = "com.twitter"),
  akkaHttpServer, // or use nettyServer for Netty
  logback, // add Play logging support
  jdbc,
  ws,
  "com.lihaoyi" %% "pprint" % "0.5.3"
)

lazy val TeamCityTest = config("teamcity").extend(Test)

enablePlugins(SystemdPlugin, PlayService, RoutesCompiler, RiffRaffArtifact, JDebPackaging, BuildInfoPlugin, GitVersioning)

lazy val root = (project in file("."))
  .configs(TeamCityTest)
  .settings(inConfig(TeamCityTest)(Defaults.testTasks))
  // Allows us to not run tests which require membership credentials in TeamCity - teamcity:test
  // Stop gap until we decide how to handle integration tests.
  .settings(
    testOptions in TeamCityTest += Tests.Argument("-l", "tags.RequiresMembershipCredentials"),
    buildInfoKeys := Seq[BuildInfoKey](
      name,
      BuildInfoKey.constant("gitCommitId", Option(System.getenv("BUILD_VCS_NUMBER"))
        .getOrElse(git.gitHeadCommit.value.getOrElse("Unknown Head Commit")))
    ),
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap
  )

resolvers += Resolver.bintrayRepo("guardian", "ophan")
resolvers += Resolver.sonatypeRepo("releases")

debianPackageDependencies := Seq("openjdk-8-jre-headless")
packageName in Debian := name.value
packageSummary := "Payment API Play App"
packageDescription := """API for reader revenue payments"""
maintainer := "Reader Revenue <reader.revenue.dev@theguardian.com>"

riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:payment-api"
riffRaffPackageType := (packageBin in Debian).value
riffRaffArtifactResources += (file("src/main/resources/cloud-formation.yaml"), "cfn/cloud-formation.yaml")
