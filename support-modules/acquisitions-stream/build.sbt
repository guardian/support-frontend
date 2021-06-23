name := "module-acquisitions-stream"

description := "Module to provide an AcquisitionsStreamService to support projects"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-java-sdk-kinesis" % "1.11.465",
)
