import LibraryVersions.awsClientVersion

name := "module-aws"

description := "aws services only (sdk v1)"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-java-sdk-cloudwatch" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
)
