import LibraryVersions.{awsClientVersion, awsClientVersion2, circeVersion}
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import sbt.Keys.libraryDependencies

version := "0.1-SNAPSHOT"

scalacOptions ++= Seq(
  "-Ymacro-annotations",
)

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "com.amazonaws" % "aws-java-sdk-ssm" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsClientVersion,
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.1",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.scala-lang.modules" %% "scala-java8-compat" % "0.9.1",
  "com.stripe" % "stripe-java" % "20.119.0",
)

riffRaffPackageType := assembly.value
riffRaffManifestProjectName := s"support:stripe-patrons-data"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (
  file("cdk/cdk.out/StripePatronsData-PROD.template.json"), "cfn/StripePatronsData-PROD.template.json"
)
riffRaffArtifactResources += (
  file("cdk/cdk.out/StripePatronsData-CODE.template.json"), "cfn/StripePatronsData-CODE.template.json"
)
assemblyJarName := s"${name.value}.jar"
assembly / assemblyMergeStrategy := {
  case PathList("models", xs @ _*) => MergeStrategy.discard
  case x if x.endsWith("io.netty.versions.properties") => MergeStrategy.first
  case x if x.endsWith("module-info.class") => MergeStrategy.discard
  case "mime.types" => MergeStrategy.first
  case name if name.endsWith("execution.interceptors") => MergeStrategy.filterDistinctLines
  case y =>
    val oldStrategy = (assembly / assemblyMergeStrategy).value
    oldStrategy(y)
}

lazy val deployToCode =
  inputKey[Unit]("Directly update AWS lambda code from local instead of via RiffRaff for faster feedback loop")

deployToCode := {
  import scala.sys.process._
  val s3Bucket = "membership-dist"
  val s3Path = "support/CODE/stripe-patrons-data/stripe-patrons-data.jar"
  (s"aws s3 cp ${assembly.value} s3://" + s3Bucket + "/" + s3Path + " --profile membership --region eu-west-1").!!
  List(
    "stripe-patrons-data-CODE",
  ).foreach(functionPartial =>
    s"aws lambda update-function-code --function-name ${functionPartial} --s3-bucket $s3Bucket --s3-key $s3Path --profile membership --region eu-west-1".!!,
  )

}
