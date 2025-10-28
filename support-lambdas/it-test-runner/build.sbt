import LibraryVersions._
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import sbt.Keys.libraryDependencies

version := "0.1-SNAPSHOT"
scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-Xfatal-warnings")

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.3",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "org.scalatest" %% "scalatest" % "3.2.19", // not a "Test" dependency, it's an actual one
)

riffRaffPackageType := assembly.value
riffRaffManifestProjectName := s"support:it-test-runner"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("support-lambdas/it-test-runner/cfn.yaml"), "cfn/cfn.yaml")
assemblyJarName := s"${name.value}.jar"
