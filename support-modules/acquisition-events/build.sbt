import LibraryVersions.*

name := "module-acquisition-events"

description := "Module for sending acquisition events"

libraryDependencies ++= Seq(
  "com.google.cloud" % "google-cloud-bigquery" % "2.34.2",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "software.amazon.awssdk" % "eventbridge" % awsClientVersion2,
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,

  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
)

scalacOptions += "-Xlint:unused"
