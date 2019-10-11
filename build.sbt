import sbt.Keys.organization

val commonSettings: Seq[SettingsDefinition] = Seq(
  scalaVersion := "2.12.10",

  libraryDependencies := Seq(
    "ch.qos.logback" % "logback-classic" % "1.2.3",
    "com.github.mpilquist" %% "simulacrum" % "0.10.0",
    "com.gu" %% "fezziwig" % "1.3",
    "com.gu" %% "ophan-event-model" % "0.0.11" excludeAll ExclusionRule(organization = "com.typesafe.play"),
    "com.gu" %% "acquisitions-value-calculator-client" % "2.0.4",
    "com.squareup.okhttp3" % "okhttp" % "3.9.0",
    "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
    "io.circe" %% "circe-core" % "0.9.1",
    "org.scalatest" %% "scalatest" % "3.0.1" % "test",
    "org.scalactic" %% "scalactic" % "3.0.1",
    "org.typelevel" %% "cats-core" % "1.0.1",
    "com.amazonaws" % "aws-java-sdk-kinesis" % "1.11.465",
    "com.gu" %% "thrift-serializer" % "4.0.2",
    compilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)
  ),
  publishTo := {
    val nexus = "https://oss.sonatype.org/"
    if (isSnapshot.value)
      Some("snapshots" at nexus + "content/repositories/snapshots")
    else
      Some("releases" at nexus + "service/local/staging/deploy/maven2")
  },
  licenses += ("MIT", url("http://opensource.org/licenses/MIT")),
  organization := "com.gu",
  bintrayOrganization := Some("guardian"),
  bintrayRepository := "ophan",
  publishMavenStyle := true
)

resolvers += Resolver.sonatypeRepo("releases")


// This project is compiled against multiple versions of `play-json` to aid compatibility.
// The root build is published as `acquisition-event-producer` and uses play-json 2.4;
// we also publish builds for play-json 2.5 and 2.6. The directories for these builds
// (`play25`, `play25` etc) aren't real files but need to be specified in this way to
// emulate separate projects.
lazy val root = (project in file("."))
  .settings(commonSettings: _*)
  .settings(
    libraryDependencies ++= Seq("com.typesafe.play" %% "play-json" % "2.6.7"),
    name := "acquisition-event-producer-play26"
  )

