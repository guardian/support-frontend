
name := "acquisition-event-producer"

version := "2.0.0-rc.3"

scalaVersion := "2.11.11"

addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

resolvers += Resolver.bintrayRepo("guardian", "ophan")

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.github.mpilquist" %% "simulacrum" % "0.10.0",
  "com.gu" %% "fezziwig" % "0.6",
  "com.gu" %% "ophan-event-model" % "1.0.0",
  "com.typesafe.akka" %% "akka-http" % "10.0.10",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "io.circe" %% "circe-core" % "0.8.0",
  "org.scalatest" %% "scalatest" % "3.0.1" % "test",
  "org.scalactic" %% "scalactic" % "3.0.1",
  "org.typelevel" %% "cats" % "0.9.0"
)

licenses += ("MIT", url("http://opensource.org/licenses/MIT"))
organization := "com.gu"
bintrayOrganization := Some("guardian")
bintrayRepository := "ophan"
publishMavenStyle := true