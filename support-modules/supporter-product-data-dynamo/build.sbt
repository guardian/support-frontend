import LibraryVersions._

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % "2.13.26",
  "org.scala-lang.modules" %% "scala-java8-compat" % "0.9.1",
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
)
