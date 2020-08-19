import sbtrelease.ReleaseStateTransformations._

name := "support-internationalisation"

crossScalaVersions := Seq("2.11.8", "2.12.7", "2.13.3")

description := "Scala library to provide internationalisation classes to Guardian Membership/Subscriptions/support projects."

libraryDependencies += "org.scalatest" %% "scalatest" % "3.1.1" % "test"

sources in doc in Compile := List()
releasePublishArtifactsAction := PgpKeys.publishSigned.value
releaseCrossBuild := true
releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  publishArtifacts,
  setNextVersion,
  commitNextVersion,
  releaseStepCommand("sonatypeReleaseAll"),
  pushChanges
)
