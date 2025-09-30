import LibraryVersions._

name := "payment-api"

version := "0.1"
scalacOptions ++= Seq(
  "-Ywarn-unused:imports",
  "-Ymacro-annotations",
)

addCompilerPlugin("org.typelevel" % "kind-projector_2.13.4" % "0.13.2")

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "ssm" % awsClientVersion2,
  "software.amazon.awssdk" % "s3" % awsClientVersion2,
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsClientVersion,
  "software.amazon.awssdk" % "sqs" % awsClientVersion2,
  "com.amazon.pay" % "amazon-pay-java-sdk" % "3.6.2",
  "com.beachape" %% "enumeratum" % "1.7.3",
  "com.beachape" %% "enumeratum-circe" % "1.7.3",
  "com.dripower" %% "play-circe" % playCirceVersion,
  "org.typelevel" %% "simulacrum" % "1.0.1",
  "com.stripe" % "stripe-java" % stripeVersion,
  "com.gocardless" % "gocardless-pro" % "2.10.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.playframework.anorm" %% "anorm" % "2.7.0",
  "org.scalatest" %% "scalatest" % "3.0.9" % "test",
  "org.scalatestplus" %% "mockito-3-4" % "3.2.10.0" % "test",
  "org.mockito" % "mockito-core" % "4.11.0",
  "org.typelevel" %% "cats-core" % catsVersion,
  "com.github.blemale" %% "scaffeine" % "4.1.0",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-core" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % jacksonVersion,
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % jacksonVersion,
  "com.google.guava" % "guava" % "25.1-jre", // -- added explicitly - snyk report avoid logback vulnerability
  "com.paypal.sdk" % "rest-api-sdk" % "1.14.0" exclude ("org.apache.logging.log4j", "log4j-slf4j-impl"),
  pekkoHttpServer, // or use nettyServer for Netty
  logback, // add Play logging support
  jdbc,
  ws,
  "com.lihaoyi" %% "pprint" % "0.8.1",
  "com.github.blemale" %% "scaffeine" % "3.1.0",

  /** This is to satisfy `amazon-pay-java-sdk` dependencies as jaxb has been removed from Java 8 => Java 11.
    *
    * As per the docs, this should work: see https://eclipse-ee4j.github.io/jaxb-ri/
    *
    * ```
    * "jakarta.xml.bind" % "jakarta.xml.bind-api" % "4.0.0",
    * "com.sun.xml.bind" % "jaxb-impl" % "4.0.3" % Runtime,
    * ```
    *
    * But annoyingly we still get this error: `java.lang.NoClassDefFoundError: javax/xml/bind/JAXBException`
    */
  "com.sun.xml.bind" % "jaxb-core" % "2.3.0.1",
  "javax.xml.bind" % "jaxb-api" % "2.3.1",
  "com.sun.xml.bind" % "jaxb-impl" % "2.3.1",
)

excludeDependencies ++= Seq(
  // Exclude htmlunit due to a vulnerability. Brought in via play-test via fluentlenium-core and htmlunit-driver but we
  // don't need it. The vulnerability is fixed in v3 onwards, but the lib was renamed so I don't think we can force a
  // newer version by specifying it in the dependencies.
  ExclusionRule("net.sourceforge.htmlunit", "htmlunit"),
  ExclusionRule("commons-beanutils", "commons-beanutils"), // Also exclude commons-beanutils due to a vulnerability
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
dependencyOverrides += "commons-io" % "commons-io" % "2.14.0" % Test
dependencyOverrides += "commons-beanutils" % "commons-beanutils" % "1.11.0" % Test

resolvers ++= Resolver.sonatypeOssRepos("releases")

Debian / packageName := name.value
packageSummary := "Payment API Play App"
packageDescription := """API for reader revenue payments"""
maintainer := "Reader Revenue <reader.revenue.dev@theguardian.com>"

riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:payment-api-mono"
riffRaffPackageType := (Debian / packageBin).value
riffRaffArtifactResources += (file("cdk/cdk.out/Payment-API-PROD.template.json"), "cfn/Payment-API-PROD.template.json")
riffRaffArtifactResources += (file("cdk/cdk.out/Payment-API-CODE.template.json"), "cfn/Payment-API-CODE.template.json")
