import LibraryVersions._

name := "support-models"

description := "Scala library to provide shared step-function models to Guardian Support projects."

libraryDependencies ++= Seq(
  "joda-time" % "joda-time" % "2.12.7",
  "org.typelevel" %% "cats-core" % catsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % "0.14.3",
  "io.circe" %% "circe-parser" % circeVersion,
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % jacksonVersion,
)
