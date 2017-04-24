import sbt._
import Keys.{scalacOptions, _}

object Settings {
  val appVersion = "0.1-SNAPSHOT"

  val shared: Seq[Def.Setting[_]] = Seq(
    version := appVersion,
    organization := "com.gu",
    scalaVersion := "2.11.8",
    scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")
  )
}