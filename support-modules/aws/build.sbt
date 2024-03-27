import LibraryVersions.*

name := "module-aws"

description := "aws services only (sdk v2)"

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "cloudwatch" % awsClientVersion2,
  "software.amazon.awssdk" % "s3" % awsClientVersion2,
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
