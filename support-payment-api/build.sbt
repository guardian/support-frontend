import LibraryVersions._

name := "payment-api"

version := "0.1"
scalacOptions ++= Seq(
  "-Ywarn-unused:imports",
  "-Ymacro-annotations",
)

addCompilerPlugin("org.typelevel" % "kind-projector_2.13.4" % "0.11.2")

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.11",
  "com.amazonaws" % "aws-java-sdk-ssm" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-ec2" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % awsClientVersion,
  "com.amazon.pay" % "amazon-pay-java-sdk" % "3.6.2",
  "com.beachape" %% "enumeratum" % "1.6.1",
  "com.beachape" %% "enumeratum-circe" % "1.6.1",
  "com.dripower" %% "play-circe" % playCirceVersion,
  "com.github.mpilquist" %% "simulacrum" % "0.19.0",
  "com.stripe" % "stripe-java" % stripeVersion,
  "com.gocardless" % "gocardless-pro" % "2.8.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.playframework.anorm" %% "anorm" % "2.6.8",
  "org.scalatest" %% "scalatest" % "3.0.4" % "test",
  "org.scalatestplus" %% "mockito-3-4" % "3.2.1.0" % "test",
  "org.mockito" % "mockito-core" % "3.4.0",
  "org.typelevel" %% "cats-core" % catsVersion,
  "com.github.blemale" %% "scaffeine" % "4.1.0",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-core" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % jacksonVersion,
  "com.google.guava" % "guava" % "25.0-jre", // -- added explicitly - snyk report avoid logback vulnerability
  "com.paypal.sdk" % "rest-api-sdk" % "1.13.0" exclude ("org.apache.logging.log4j", "log4j-slf4j-impl"),
  akkaHttpServer, // or use nettyServer for Netty
  logback, // add Play logging support
  jdbc,
  ws,
  "com.lihaoyi" %% "pprint" % "0.6.0",
  "com.github.blemale" %% "scaffeine" % "3.1.0",
  "org.scala-lang.modules" %% "scala-xml" % "1.2.0",
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion

resolvers += Resolver.sonatypeRepo("releases")

debianPackageDependencies := Seq("openjdk-8-jre-headless")
Debian / packageName := name.value
packageSummary := "Payment API Play App"
packageDescription := """API for reader revenue payments"""
maintainer := "Reader Revenue <reader.revenue.dev@theguardian.com>"

riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:payment-api-mono"
riffRaffPackageType := (Debian / packageBin).value
riffRaffArtifactResources += (file("support-payment-api/src/main/resources/cloud-formation.yaml"), "cfn/cfn.yaml")
