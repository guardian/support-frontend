import LibraryVersions.awsClientVersion2
import sbtrelease.ReleaseStateTransformations._

name := "support-product-data-dynamo"

scalaVersion := "3.1.2" // beware >= 3.1.3 has an incompatibility with <= 2.13.8 which causes compile issue `Unsupported Scala 3 generic tuple type scala.Tuple in bounds of type MirroredElemTypes; found in  scala.deriving.Mirror.<refinement>.`
crossScalaVersions := Seq("2.13.10", "3.1.2")


//releaseTagComment        := s"Releasing $name-${(ThisBuild / version).value}"
//
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
