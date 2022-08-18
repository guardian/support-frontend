import sbtrelease.ReleaseStateTransformations._

name := "support-internationalisation"

scalaVersion := "3.1.2" // beware >= 3.1.3 has an incompatibility with <= 2.13.8 which causes compile issue `Unsupported Scala 3 generic tuple type scala.Tuple in bounds of type MirroredElemTypes; found in  scala.deriving.Mirror.<refinement>.`
crossScalaVersions := Seq("2.13.8", "3.1.2")

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
