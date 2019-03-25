import LibraryVersions.{catsVersion, circeVersion}
import sbtrelease.ReleaseStateTransformations._

name := "support-models"

description := "Scala library to provide shared step-function models to Guardian Support projects."

libraryDependencies ++= Seq(
  "com.gu" %% "acquisition-event-producer-play26" % "4.0.18",
  "org.typelevel" %% "cats-core" % catsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion
)


releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  publishArtifacts,
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _), enableCrossBuild = false),
  setNextVersion,
  commitNextVersion,
  pushChanges
)

