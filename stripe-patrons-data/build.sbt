import LibraryVersions.{awsClientVersion, awsClientVersion2, circeVersion}
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import sbt.Keys.libraryDependencies

version := "0.1-SNAPSHOT"

scalacOptions ++= Seq(
  "-Ymacro-annotations",
)

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "software.amazon.awssdk" % "ssm" % awsClientVersion2,
  "com.amazonaws" % "aws-lambda-java-core" % "1.2.3",
  "com.amazonaws" % "aws-lambda-java-events" % "3.11.5",
  "com.stripe" % "stripe-java" % "20.136.0",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
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
// We use the buildNumber to set the lambda fileName, because lambda versioning requires a new fileName each time
val buildNumber = sys.env.getOrElse("GITHUB_RUN_NUMBER", "DEV")
assemblyJarName := s"${name.value}-$buildNumber.jar"
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

// We also have to put the build number in the .jar, because AWS refuses to create a new lambda version if the jar is the same!
resourceGenerators in Compile += Def.task {
  val file = (resourceManaged).value / "build.number"
  IO.write(file, buildNumber)
  Seq(file)
}.taskValue
