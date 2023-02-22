import LibraryVersions.awsClientVersion2

name := "support-product-data-dynamo"
releaseVersionFile := file("support-modules/" + name.value + "/version.sbt")

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "org.scala-lang.modules" %% "scala-java8-compat" % "1.0.2",
)
