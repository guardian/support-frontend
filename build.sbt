import sbtrelease.ReleaseStateTransformations._

name := "support-models"

organization := "com.gu"

scalaVersion := "2.11.8"

crossScalaVersions := Seq("2.11.8", "2.12.2")

scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/support-models"),
  "scm:git:git@github.com:guardian/support-models.git"
))

description := "Scala library to provide shared step-function models to Guardian Support projects."

licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html"))

libraryDependencies ++= Seq(
  "com.gu" %% "support-internationalisation" % "0.5" % "provided"
)

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

    
