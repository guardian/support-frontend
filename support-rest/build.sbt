import LibraryVersions.{awsClientVersion, catsVersion, circeVersion, okhttpVersion}

name := "support-services"

description := "Scala library to provide shared services to Guardian Support projects."

// rest
libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "org.typelevel" %% "cats-core" % catsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
)
