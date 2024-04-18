import LibraryVersions.circeVersion
import LibraryVersions._

name := "bigquery-acquisitions-publisher"
description := "A lambda for publishing acquisitions events to BigQuery"

libraryDependencies ++= Seq(
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.0",
  "com.amazonaws" % "aws-lambda-java-events" % "3.11.1",
  "com.amazonaws" % "aws-java-sdk-ssm" % awsClientVersion,
  "ch.qos.logback" % "logback-classic" % "1.5.6",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
)

assemblyJarName := s"${name.value}.jar"
riffRaffPackageType := assembly.value
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := s"support:lambdas:${name.value}"
riffRaffArtifactResources += (file(
  "cdk/cdk.out/BigqueryAcquisitionsPublisher-PROD.template.json",
), "cfn/BigqueryAcquisitionsPublisher-PROD.template.json")
riffRaffArtifactResources += (file(
  "cdk/cdk.out/BigqueryAcquisitionsPublisher-CODE.template.json",
), "cfn/BigqueryAcquisitionsPublisher-CODE.template.json")

lazy val deployToCode =
  inputKey[Unit]("Directly update AWS lambda code from local instead of via RiffRaff for faster feedback loop")

deployToCode := {
  import scala.sys.process._
  val s3Bucket = "membership-dist"
  val s3Path = "support/CODE/bigquery-acquisitions-publisher/bigquery-acquisitions-publisher.jar"
  (s"aws s3 cp ${assembly.value} s3://" + s3Bucket + "/" + s3Path + " --profile membership --region eu-west-1").!!
  List(
    "bigquery-acquisitions-publisher-CODE",
  ).foreach(functionPartial => {
    System.out.println(s"Updating function $functionPartial")
    s"aws lambda update-function-code --function-name $functionPartial --s3-bucket $s3Bucket --s3-key $s3Path --profile membership --region eu-west-1".!!
  })
}
