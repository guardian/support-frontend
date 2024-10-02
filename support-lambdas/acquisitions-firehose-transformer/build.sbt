import LibraryVersions.circeVersion

name := "acquisitions-firehose-transformer"
description := "A Firehose transformation lambda for serialising the acquisitions event stream to csv"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-events" % "3.11.6",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "org.scanamo" %% "scanamo" % "1.0.0-M26",
)

assemblyJarName := s"${name.value}.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := s"support:lambdas:${name.value}"
riffRaffArtifactResources += (file(s"support-lambdas/${name.value}/cfn.yaml"), "cfn/cfn.yaml")
