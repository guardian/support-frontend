import LibraryVersions.circeVersion
import LibraryVersions._

name := "acquisition-events-api"
description := "A lambda for acquisitions events api"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
)

assemblyJarName := s"${name.value}.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := s"support:lambdas:${name.value}"
riffRaffArtifactResources += (file(
  "cdk/cdk.out/Acquisition-Events-API-PROD.template.json",
), "cfn/Acquisition-Events-API-PROD.template.json")
riffRaffArtifactResources += (file(
  "cdk/cdk.out/Acquisition-Events-API-CODE.template.json",
), "cfn/Acquisition-Events-API-CODE.template.json")
