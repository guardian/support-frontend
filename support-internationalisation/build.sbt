import sbtrelease.ReleaseStateTransformations._

name := "support-internationalisation"

scalaVersion := "2.13.17"
crossScalaVersions := Seq("2.13.17", "3.3.3")

description := "Scala library to provide internationalisation classes to Guardian Membership/Subscriptions/support projects."

releaseCrossBuild := true
releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  ReleaseStep(action = Command.process("publishSigned", _), enableCrossBuild = true),
  setNextVersion,
  commitNextVersion,
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _), enableCrossBuild = true),
  pushChanges,
)
