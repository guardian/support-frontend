import LibraryVersions.{jacksonDatabindVersion, jacksonVersion}

name := "module-acquisitions-stream"

description := "Module to provide an AcquisitionsStreamService to support projects"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-java-sdk-kinesis" % "1.12.10",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
)
