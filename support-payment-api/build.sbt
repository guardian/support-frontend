import LibraryVersions._

name := "payment-api"

version := "0.1"
scalaVersion := "2.12.4"
scalacOptions ++= Seq(
  "-Ywarn-unused:imports"
)

addCompilerPlugin("org.spire-math" %% "kind-projector" % "0.9.6")
addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.amazonaws" % "aws-java-sdk-ssm" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-ec2" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % AWSJavaSDKVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % AWSJavaSDKVersion,
  "com.amazon.pay" % "amazon-pay-java-sdk" % "3.6.2",
  "com.beachape" %% "enumeratum" % "1.5.12",
  "com.beachape" %% "enumeratum-circe" % "1.5.12",
  "com.dripower" %% "play-circe" % playCirceVersion,
  "com.github.mpilquist" %% "simulacrum" % "0.11.0",
  "com.stripe" % "stripe-java" % stripeVersion,
  "com.gocardless" % "gocardless-pro" % "2.8.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.playframework.anorm" %% "anorm" % "2.6.0",
  "org.scalatest" %% "scalatest" % "3.0.4" % "test",
  "org.scalatestplus" %% "mockito-3-4" % "3.2.1.0" % "test",
  "org.mockito" % "mockito-core" % "3.4.0",
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
  "org.apache.thrift" % "libthrift" % "0.12.0",// needed for snyk deps https://app.snyk.io/vuln/SNYK-JAVA-ORGAPACHETHRIFT-173706
  akkaHttpServer, // or use nettyServer for Netty
  logback, // add Play logging support
  jdbc,
  ws,
  "com.lihaoyi" %% "pprint" % "0.5.3",
  "com.github.blemale" %% "scaffeine" % "3.1.0",
  "org.scala-lang.modules" %% "scala-xml" % "1.2.0"
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
riffRaffManifestProjectName := "support:payment-api-mono"
riffRaffPackageType := (packageBin in Debian).value
riffRaffArtifactResources += (file("support-payment-api/src/main/resources/cloud-formation.yaml"), "cfn/cfn.yaml")
