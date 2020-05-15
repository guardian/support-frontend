import sbt.Keys.organization

val commonSettings: Seq[SettingsDefinition] = Seq(
  scalaVersion := "2.13.1",

  libraryDependencies := Seq(
    "ch.qos.logback" % "logback-classic" % "1.2.3",
    "org.typelevel" %% "simulacrum" % "1.0.0",
    "com.gu" %% "fezziwig" % "1.3",
    "com.gu" %% "ophan-event-model" % "0.0.17" excludeAll ExclusionRule(organization = "com.typesafe.play"),
    "com.gu" %% "acquisitions-value-calculator-client" % "2.0.5",
    "com.squareup.okhttp3" % "okhttp" % "3.9.0",
    "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
    "io.circe" %% "circe-core" % "0.12.1",
    "org.scalatest" %% "scalatest" % "3.1.1" % "test",
    "org.scalactic" %% "scalactic" % "3.1.1",
    "org.typelevel" %% "cats-core" % "2.1.1",
    "com.amazonaws" % "aws-java-sdk-kinesis" % "1.11.465",
    "com.gu" %% "thrift-serializer" % "4.0.3"
  ),
  scalacOptions += "-Ymacro-annotations",
  licenses += ("MIT", url("http://opensource.org/licenses/MIT")),
  organization := "com.gu",
  bintrayOrganization := Some("guardian"),
  bintrayRepository := "ophan",
  publishMavenStyle := true
)

resolvers += Resolver.sonatypeRepo("releases")


lazy val root = (project in file("."))
  .aggregate(eventProducerPlayJson27, eventProducerPlayJson28)
  .settings(
    sourceDirectory := baseDirectory.value / "dummy",
    publishArtifact := false
  )

lazy val eventProducerPlayJson27 = (project in file("play27"))
  .settings(commonSettings: _*)
  .settings(
    sourceDirectory := baseDirectory.value / "../src",
    libraryDependencies ++= Seq("com.typesafe.play" %% "play-json" % "2.7.4"),
    name := "acquisition-event-producer-play27"
  )

lazy val eventProducerPlayJson28 = (project in file("play28"))
  .settings(commonSettings: _*)
  .settings(
    sourceDirectory := baseDirectory.value / "../src",
    libraryDependencies ++= Seq("com.typesafe.play" %% "play-json" % "2.8.1"),
    name := "acquisition-event-producer-play28"
  )
