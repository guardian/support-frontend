import sbt.Keys.{scalacOptions, _}
import sbt._

object Settings {
  val appVersion = "0.1-SNAPSHOT"

  val shared: Seq[Def.Setting[_]] = Seq(
    version := appVersion,
    organization := "com.gu",
    scalaVersion := "2.11.8",
    scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings"),
    //Don't run tests marked as integration tests
    testOptions in Test += Tests.Argument("-l", "com.gu.test.tags.annotations.IntegrationTest")
  )
}