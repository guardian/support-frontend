import LibraryVersions.{awsClientVersion, circeVersion, jacksonDatabindVersion, jacksonVersion, okhttpVersion}

name := "stripe-intent"
description := "Returns a stripe setup intent token so we can get authorisation of a recurring payment on the client side"

assemblyJarName := "stripe-intent.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:lambdas:Stripe Intent"
riffRaffArtifactResources += (file("support-lambdas/stripe-intent/cfn.yaml"), "cfn/cfn.yaml")
assembly / assemblyMergeStrategy := {
  case x if x.endsWith("module-info.class") => MergeStrategy.discard
  case str if str.contains("simulacrum") => MergeStrategy.first
  case PathList("javax", "annotation", _ @_*) => MergeStrategy.first
  case y =>
    val oldStrategy = (assembly / assemblyMergeStrategy).value
    oldStrategy(y)
}

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser",
).map(_ % circeVersion)

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.2",
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
  "ch.qos.logback" % "logback-classic" % "1.2.12",
)
