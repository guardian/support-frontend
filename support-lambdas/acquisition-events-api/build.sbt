import LibraryVersions.circeVersion
import LibraryVersions._

name := "acquisition-events-api"
description := "A lambda for acquisitions events api"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
)

assemblyJarName := s"${name.value}.jar"

// simple-configuration-ssm:7.0.0 transitively pulls in apache-client:2.32.27 which
// conflicts with apache5-client:2.46.5 during assembly
excludeDependencies += ExclusionRule("software.amazon.awssdk", "apache-client")