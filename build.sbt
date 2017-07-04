import sbtrelease.ReleaseStateTransformations._

name := "support-internationalisation"

organization := "com.gu"

scalaVersion := "2.11.8"

crossScalaVersions := Seq("2.12.2")

scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/support-internationalisation"),
  "scm:git:git@github.com:guardian/support-internationalisation.git"
))

description := "Scala library to provide internationalisation classes to Guardian Membership/Subscriptions/support projects."

licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html"))

releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  ReleaseStep(action = Command.process("publishSigned", _)),
  setNextVersion,
  commitNextVersion,
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _)),
  pushChanges
)

    