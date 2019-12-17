import LibraryVersions.{catsVersion, circeVersion}

name := "support-models"

description := "Scala library to provide shared step-function models to Guardian Support projects."

libraryDependencies ++= Seq(
  "com.gu" %% "acquisition-event-producer-play26" % "4.0.25", //this should really be split into models and producer
                                                              // so we don't have to pull in thrift binary compression libs etc
  "com.gu" %% "support-internationalisation" % "0.12",
  "org.typelevel" %% "cats-core" % catsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion
)
