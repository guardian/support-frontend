import sbtrelease.ReleaseStateTransformations._

name := "support-internationalisation"

organization := "com.gu"

scalaVersion := "2.11.8"

crossScalaVersions := Seq("2.11.8", "2.12.2")

libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.4" % "test"

scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/support-internationalisation"),
  "scm:git:git@github.com:guardian/support-internationalisation.git"
))

description := "Scala library to provide internationalisation classes to Guardian Membership/Subscriptions/support projects."

licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html"))

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
  pushChanges
)

    