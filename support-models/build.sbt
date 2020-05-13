import LibraryVersions.{catsVersion, circeVersion, jacksonVersion}

name := "support-models"

description := "Scala library to provide shared step-function models to Guardian Support projects."

libraryDependencies ++= Seq(
  "com.gu" %% "acquisition-event-producer-play26" % "4.0.27", //this should really be split into models and producer
                                                              // so we don't have to pull in thrift binary compression libs etc
  "org.typelevel" %% "cats-core" % catsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % jacksonVersion
)
