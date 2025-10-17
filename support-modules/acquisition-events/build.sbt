import LibraryVersions.*

name := "module-acquisition-events"

description := "Module for sending acquisition events"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "software.amazon.awssdk" % "eventbridge" % awsClientVersion2,
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,

  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.google.protobuf" % "protobuf-java" % "3.25.5",
)

scalacOptions += "-Xlint:unused"
