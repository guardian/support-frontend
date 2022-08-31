import LibraryVersions.{awsClientVersion, awsClientVersion2, circeVersion}
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import sbt.Keys.libraryDependencies

version := "0.1-SNAPSHOT"

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.11",
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "com.amazonaws" % "aws-java-sdk-ssm" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsClientVersion,
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.1",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.scala-lang.modules" %% "scala-java8-compat" % "1.0.2",
  "com.nrinaudo" %% "kantan.csv-generic" % "0.6.1",
  "com.nrinaudo" %% "kantan.csv-java8" % "0.6.1",
)

riffRaffPackageType := assembly.value
riffRaffManifestProjectName := s"support:supporter-product-data"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("supporter-product-data/cloudformation/cfn.yaml"), "cfn/cfn.yaml")
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
  inputKey[Unit]("Directly update AWS lambda code from DEV instead of via RiffRaff for faster feedback loop")

deployToCode := {
  import scala.sys.process._
  val s3Bucket = "supporter-product-data-dist"
  val s3Path = "support/DEV/supporter-product-data/supporter-product-data.jar"
  (s"aws s3 cp ${assembly.value} s3://" + s3Bucket + "/" + s3Path + " --profile membership --region eu-west-1").!!
  List(
    "-SupporterProductDataQueryZuora-",
    "-SupporterProductDataFetchResults-",
    "-SupporterProductDataUpdateDynamo-",
  ).foreach(functionPartial =>
    s"aws lambda update-function-code --function-name support${functionPartial}DEV --s3-bucket $s3Bucket --s3-key $s3Path --profile membership --region eu-west-1".!!,
  )

}

lazy val deployToProd =
  inputKey[Unit]("Directly update AWS lambda code to PROD instead of via RiffRaff for faster feedback loop")

deployToProd := {
  import scala.sys.process._
  val s3Bucket = "supporter-product-data-dist"
  val s3Path = "support/PROD/supporter-product-data/supporter-product-data.jar"
  (s"aws s3 cp ${assembly.value} s3://" + s3Bucket + "/" + s3Path + " --profile membership --region eu-west-1").!!
  List(
    "-SupporterProductDataQueryZuora-",
    "-SupporterProductDataFetchResults-",
    "-SupporterProductDataUpdateDynamo-",
  ).foreach(functionPartial =>
    s"aws lambda update-function-code --function-name support${functionPartial}PROD --s3-bucket $s3Bucket --s3-key $s3Path --profile membership --region eu-west-1".!!,
  )

}
