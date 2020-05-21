import sbt.Keys.organization

val commonSettings: Seq[SettingsDefinition] = Seq(
  scalaVersion := "2.12.11",

//  scalacOptions += "-Ymacro-annotations",//for simulacrum scala 2.13
  licenses += ("MIT", url("http://opensource.org/licenses/MIT")),
  organization := "com.gu",
  bintrayOrganization := Some("guardian"),
  bintrayRepository := "ophan",
  publishMavenStyle := true
)

resolvers += Resolver.sonatypeRepo("releases")


lazy val models = (project in file("models"))
  .settings(commonSettings: _*)
  .settings(
    addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.1" cross CrossVersion.full), // for simulacrum
    libraryDependencies ++= Seq(
      "com.gu" %% "ophan-event-model" % "0.0.17" excludeAll ExclusionRule(organization = "com.typesafe.play"),
      "org.typelevel" %% "simulacrum" % "1.0.0",
      "com.gu" %% "fezziwig" % "1.3",
      "io.circe" %% "circe-core" % "0.12.1",
      "com.typesafe.play" %% "play-json" % "2.6.14",
      "org.scalatest" %% "scalatest" % "3.1.1" % "test"
    ),
    name := "acquisition-event-models-play26"
  )

lazy val client = (project in file("client"))
  .settings(commonSettings: _*)
  .settings(
    addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.1" cross CrossVersion.full), // for simulacrum
    libraryDependencies ++= Seq(
      "ch.qos.logback" % "logback-classic" % "1.2.3",
      "com.gu" %% "acquisitions-value-calculator-client" % "2.0.5",
      "com.squareup.okhttp3" % "okhttp" % "3.9.0",
      "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
      "org.typelevel" %% "simulacrum" % "1.0.0",
      "org.scalatest" %% "scalatest" % "3.1.1" % "test",
      "org.scalactic" %% "scalactic" % "3.1.1",
      "org.typelevel" %% "cats-core" % "2.1.1",
      "com.amazonaws" % "aws-java-sdk-kinesis" % "1.11.465",
      "com.gu" %% "thrift-serializer" % "4.0.3"
    ),
    name := "acquisition-event-client-play26"
  )
  .dependsOn(models)

