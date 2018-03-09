import sbtrelease.ReleaseStateTransformations._

name := "support-config"

organization := "com.gu"

description := "Scala library to provide shared configuration to Guardian Support projects."

scalaVersion := "2.11.8"

crossScalaVersions := Seq(scalaVersion.value, "2.12.4")

scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/support-models"),
  "scm:git:git@github.com:guardian/support-models.git"
))

licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html"))

libraryDependencies ++= Seq(
  "com.typesafe" % "config" % "1.3.1",
  "com.gu" %% "support-internationalisation" % "0.9"
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
  ReleaseStep(action = Command.process("publishSigned", _)),
  setNextVersion,
  commitNextVersion,
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _)),
  pushChanges
)
