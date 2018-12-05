import sbt.Keys.{publishTo, resolvers, scalaVersion}
import sbtrelease.ReleaseStateTransformations._

val release = Seq[ReleaseStep](
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

lazy val commonSettings = Seq(
  organization := "com.gu",
  scalaVersion := "2.12.7",
  resolvers ++= Seq(Resolver.sonatypeRepo("releases"), Resolver.bintrayRepo("guardian", "ophan")),
  isSnapshot := true,
  publishTo := {
    val nexus = "https://oss.sonatype.org/"
    if (isSnapshot.value)
      Some("snapshots" at nexus + "content/repositories/snapshots")
    else
      Some("releases" at nexus + "service/local/staging/deploy/maven2")
  },
  licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html")),
  releaseProcess := release
)

lazy val commonDependencies = Seq(
  "com.typesafe" % "config" % "1.3.2",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test"
)

lazy val supportModels = (project in file("support-models"))
  .settings(
    commonSettings,
    libraryDependencies ++= commonDependencies
  )
lazy val supportConfig = (project in file("support-config"))
  .settings(
    commonSettings,
    libraryDependencies ++= commonDependencies
  )
lazy val supportServices = (project in file("support-services"))
  .settings(
    commonSettings,
    libraryDependencies ++= commonDependencies
  )
