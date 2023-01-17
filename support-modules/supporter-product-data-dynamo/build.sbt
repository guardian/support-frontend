import LibraryVersions.awsClientVersion2
import sbtrelease.ReleaseStateTransformations._

name := "support-product-data-dynamo"

releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
//  ReleaseStep(action = Command.process("publishSigned", _), enableCrossBuild = true),
//  setNextVersion,
//  commitNextVersion,
//  ReleaseStep(action = Command.process("sonatypeReleaseAll", _), enableCrossBuild = true),
//  pushChanges,
)

libraryDependencies ++= Seq(
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "org.scala-lang.modules" %% "scala-java8-compat" % "1.0.2",
)
