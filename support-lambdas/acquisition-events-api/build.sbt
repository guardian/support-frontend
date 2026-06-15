import LibraryVersions.circeVersion
import LibraryVersions._

name := "acquisition-events-api"
description := "A lambda for acquisitions events api"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
)

assemblyJarName := s"${name.value}.jar"