import sbt.Keys.{scalacOptions, _}
import sbt._

object Settings {
  val appVersion = "0.1-SNAPSHOT"

  val shared: Seq[Def.Setting[_]] = Seq(
    version := appVersion,
    organization := "com.gu",
    scalaVersion := "2.12.4",
    scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")
  )

  val testSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
    scalaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "scala",
    javaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "java",
    testOptions in Test := Seq(Tests.Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest"))
  )
}