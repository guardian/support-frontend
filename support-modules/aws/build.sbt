import LibraryVersions.*

name := "module-aws"

description := "aws services only (sdk v2)"

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "cloudwatch" % awsClientVersion2,
  "software.amazon.awssdk" % "s3" % awsClientVersion2,
  "com.amazonaws" % "aws-java-sdk-core" % awsClientVersion, // for ASyncHandler only
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
