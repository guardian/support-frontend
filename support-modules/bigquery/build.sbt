import LibraryVersions.circeVersion

name := "module-bigquery"

description := "Module to provide BigQuery functionality to support projects"

libraryDependencies ++= Seq(
  "com.google.cloud" % "google-cloud-bigquery" % "1.126.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion
)
