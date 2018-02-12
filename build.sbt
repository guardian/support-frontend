import sbt.Keys.organization

val commonSettings: Seq[SettingsDefinition] = Seq(
  scalaVersion := "2.11.11",

  libraryDependencies := Seq(
    "ch.qos.logback" % "logback-classic" % "1.2.3",
    "com.github.mpilquist" %% "simulacrum" % "0.10.0",
    "com.gu" %% "fezziwig" % "0.8",
    "com.gu" %% "ophan-event-model" % "0.0.2" excludeAll(ExclusionRule(organization = "com.typesafe.play")),
    "com.squareup.okhttp3" % "okhttp" % "3.9.0",
    "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
    "io.circe" %% "circe-core" % "0.9.1",
    "org.scalatest" %% "scalatest" % "3.0.1" % "test",
    "org.scalactic" %% "scalactic" % "3.0.1",
    "org.typelevel" %% "cats-core" % "1.0.1",
    compilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)
  ),

  licenses += ("MIT", url("http://opensource.org/licenses/MIT")),
  organization := "com.gu",
  bintrayOrganization := Some("guardian"),
  bintrayRepository := "ophan",
  publishMavenStyle := true
)

// This project is compiled against multiple versions of `play-json` to aid compatibility.
// The root build is published as `acquisition-event-producer` and uses play-json 2.4;
// we also publish builds for play-json 2.5 and 2.6. The directories for these builds
// (`play25`, `play25` etc) aren't real files but need to be specified in this way to
// emulate separate projects.
lazy val root = (project in file("."))
  .aggregate(eventProducerPlayJson25, eventProducerPlayJson26)
  .settings(commonSettings: _*)
  .settings(
    libraryDependencies ++= Seq("com.typesafe.play" %% "play-json" % "2.4.11"),
    name := "acquisition-event-producer-play24"
  )

lazy val eventProducerPlayJson25 = (project in file("play25"))
  .settings(commonSettings: _*)
  .settings(
    sourceDirectory := baseDirectory.value / "../src",
    libraryDependencies ++= Seq("com.typesafe.play" %% "play-json" % "2.5.18"),
    name := "acquisition-event-producer-play25"
  )

lazy val eventProducerPlayJson26 = (project in file("play26"))
  .settings(commonSettings: _*)
  .settings(
    sourceDirectory := baseDirectory.value / "../src",
    libraryDependencies ++= Seq("com.typesafe.play" %% "play-json" % "2.6.7"),
    name := "acquisition-event-producer-play26"
  )
