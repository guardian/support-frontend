import LibraryVersions.circeVersion

name := "acquisitions-firehose-transformer"
description := "A Firehose transformation lambda for serialising the acquisitions event stream to csv"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-events" % "3.11.1",
  "ch.qos.logback" % "logback-classic" % "1.1.11",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "org.scanamo" %% "scanamo" % "1.0.0-M23",
)

assemblyJarName := s"${name.value}.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := s"support:lambdas:${name.value}"
riffRaffArtifactResources += (file(s"support-lambdas/${name.value}/cfn.yaml"), "cfn/cfn.yaml")

assembly / assemblyMergeStrategy := {
  case PathList("deriving.conf") => MergeStrategy.concat
  case y =>
    val oldStrategy = (assembly / assemblyMergeStrategy).value
    oldStrategy(y)
}
