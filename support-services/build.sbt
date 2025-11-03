import LibraryVersions.awsClientVersion2

name := "support-services"

description := "Scala library to provide shared services to Guardian Support projects."

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb-enhanced" % awsClientVersion2,
  "org.scala-stm" %% "scala-stm" % "0.11.1", // only for promotions
  "software.amazon.awssdk" % "location" % awsClientVersion2,
  "software.amazon.awssdk" % "geoplaces" % awsClientVersion2,
)
