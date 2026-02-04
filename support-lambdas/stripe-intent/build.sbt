import LibraryVersions.{awsClientVersion2, circeVersion, jacksonDatabindVersion, jacksonVersion, okhttpVersion}

name := "stripe-intent"
description := "Returns a stripe setup intent token so we can get authorisation of a recurring payment on the client side"

assemblyJarName := "stripe-intent.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:lambdas:Stripe Intent"
riffRaffArtifactResources += (file("support-lambdas/stripe-intent/cfn.yaml"), "cfn/cfn.yaml")

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser",
).map(_ % circeVersion)

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-core" % "1.4.0",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
)
