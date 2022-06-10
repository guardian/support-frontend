import LibraryVersions._
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import sbt.Keys.libraryDependencies

version := "0.1-SNAPSHOT"
scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")

libraryDependencies ++= Seq(
  "org.joda" % "joda-convert" % "2.0.1",
  "org.typelevel" %% "cats-core" % catsVersion,
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.0",
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "io.symphonia" % "lambda-logging" % "1.0.1",
  "com.squareup.okhttp3" % "okhttp" % okhttpVersion,
  "io.lemonlabs" %% "scala-uri" % scalaUriVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sqs" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsClientVersion,
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "org.mockito" %% "mockito-scala" % "1.15.1" % "it,test",
  "org.mockito" %% "mockito-scala-scalatest" % "1.15.1" % "it,test",
  "org.scalatestplus" %% "scalatestplus-mockito" % "1.0.0-M2" % "it,test",
  "org.scalatestplus" %% "scalatestplus-selenium" % "1.0.0-M2" % "it,test",
  "com.squareup.okhttp3" % "mockwebserver" % okhttpVersion % "it,test",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.sentry" % "sentry-logback" % "1.7.4",
  "com.google.code.findbugs" % "jsr305" % "3.0.2",
  "com.gocardless" % "gocardless-pro" % "2.8.0",
)

riffRaffPackageType := assembly.value
riffRaffManifestProjectName := s"support:support-workers-mono"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("support-workers/cloud-formation/target/cfn.yaml"), "cfn/cfn.yaml")
riffRaffArtifactResources += (file(
  "support-workers/target/scala-2.13/support-workers-it.jar",
), "it-tests/support-workers-it.jar")
assemblyJarName := s"${name.value}.jar"

Project.inConfig(IntegrationTest)(baseAssemblySettings)
IntegrationTest / assembly / assemblyJarName := s"${name.value}-it.jar"
IntegrationTest / assembly / assemblyMergeStrategy := {
  case PathList("models", xs @ _*) => MergeStrategy.discard
  case x if x.endsWith("io.netty.versions.properties") => MergeStrategy.first
  case x if x.endsWith("logback.xml") => MergeStrategy.first
  case x if x.endsWith("module-info.class") => MergeStrategy.discard
  case "mime.types" => MergeStrategy.first
  case name if name.endsWith("execution.interceptors") => MergeStrategy.filterDistinctLines
  case PathList("javax", "annotation", _ @_*) => MergeStrategy.first
  case y =>
    val oldStrategy = (assembly / assemblyMergeStrategy).value
    oldStrategy(y)
}
IntegrationTest / assembly / test := {}
assembly / aggregate := false

lazy val deployToCode =
  inputKey[Unit]("Directly update AWS lambda code from DEV instead of via RiffRaff for faster feedback loop")

deployToCode := {
  import scala.sys.process._
  val s3Bucket = "support-workers-dist"
  val s3Path = "support/CODE/support-workers/support-workers.jar"
  (s"aws s3 cp ${assembly.value} s3://" + s3Bucket + "/" + s3Path + " --profile membership --region eu-west-1").!!
  List(
    "-CreatePaymentMethodLambda-",
    "-CreateSalesforceContactLambda-",
    "-CreateZuoraSubscriptionLambda-",
    "-SendThankYouEmailLambda-",
    "-UpdateSupporterProductDataLambda-",
    "-FailureHandlerLambda-",
    "-SendAcquisitionEventLambda-",
    "-PreparePaymentMethodForReuseLambda-",
  ).foreach(functionPartial =>
    s"aws lambda update-function-code --function-name support${functionPartial}CODE --s3-bucket $s3Bucket --s3-key $s3Path --profile membership --region eu-west-1".!!,
  )

}
