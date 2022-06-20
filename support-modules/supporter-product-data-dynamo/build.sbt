import LibraryVersions.awsClientVersion2

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "org.scala-lang.modules" %% "scala-java8-compat" % "1.0.2",
)
