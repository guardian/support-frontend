import LibraryVersions.{awsClientVersion, catsVersion, circeVersion, okhttpVersion, scalaLogging}

name := "support-rest"

description := "Scala library to provide shared services to Guardian Support projects."

// rest
libraryDependencies ++= Seq(
  scalaLogging,
  "org.typelevel" %% "cats-core" % catsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
)
