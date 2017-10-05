
name := "acquisition-event-producer"

version := "2.0.0-rc.5"

scalaVersion := "2.11.11"

addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

publishTo := {
  val nexus = "https://oss.sonatype.org/"
  if (isSnapshot.value)
    Some("snapshots" at nexus + "content/repositories/snapshots")
  else
    Some("releases" at nexus + "service/local/staging/deploy/maven2")
}


scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/acquisition-event-producer"),
  "scm:git:git@github.com:guardian/acquisition-event-producer.git"
))


sonatypeProfileName := "com.gu"

pomExtra := (
  <url>https://github.com/guardian/acquisition-event-producer</url>
    <developers>
      <developer>
        <id>desbo</id>
        <name>Sam Desborough</name>
        <url>https://github.com/desbo</url>
      </developer>
    </developers>
  )

licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html"))

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.github.mpilquist" %% "simulacrum" % "0.10.0",
  "com.gu" %% "fezziwig" % "0.6",
  "com.gu" %% "ophan-event-model" % "1.0.0",
  "com.squareup.okhttp3" % "okhttp" % "3.9.0",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "io.circe" %% "circe-core" % "0.8.0",
  "org.scalatest" %% "scalatest" % "3.0.1" % "test",
  "org.scalactic" %% "scalactic" % "3.0.1",
  "org.typelevel" %% "cats" % "0.9.0"
)

licenses += ("MIT", url("http://opensource.org/licenses/MIT"))
organization := "com.gu"
publishMavenStyle := true