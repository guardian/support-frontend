import LibraryVersions.{circeVersion, jacksonDatabindVersion, jacksonVersion, okhttpVersion}

name := "module-acquisition-events"

description := "Module for sending acquisition events"

libraryDependencies ++= Seq(
  "com.google.cloud" % "google-cloud-bigquery" % "2.8.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "com.amazonaws" % "aws-java-sdk-kinesis" % "1.12.171",
  "com.gu" %% "acquisitions-value-calculator-client" % "2.0.6",
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,

  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
)
