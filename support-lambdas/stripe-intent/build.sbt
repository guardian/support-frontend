import LibraryVersions.{awsClientVersion, catsVersion, circeVersion, okhttpVersion}

name := "stripe-intent"
description:= "Returns a stripe setup intent token so we can get authorisation of a recurring payment on the client side"

scalacOptions += "-Ypartial-unification"

assemblyJarName := "stripe-intent.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:lambdas:Stripe Intent"
riffRaffArtifactResources += (file("support-lambdas/stripe-intent/cfn.yaml"), "cfn/cfn.yaml")
riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch")
riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV")
assemblyMergeStrategy in assembly := {
  case x if x.endsWith("module-info.class") => MergeStrategy.discard
  case y =>
    val oldStrategy = (assemblyMergeStrategy in assembly).value
    oldStrategy(y)
}

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core",
  "io.circe" %% "circe-generic",
  "io.circe" %% "circe-parser"
).map(_ % circeVersion)

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.0",
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
  "ch.qos.logback" % "logback-classic" % "1.2.3",
)
