name := "payment-api"

version := "0.1"
scalaVersion := "2.12.4"
scalacOptions += "-Ypartial-unification"

addCompilerPlugin("org.spire-math" %% "kind-projector" % "0.9.4")
addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

val circeVersion = "0.9.1"

libraryDependencies ++= Seq(
  "ch.qos.logback" % "logback-classic" % "1.2.3",
  "com.amazonaws" % "aws-java-sdk-ssm" % "1.11.261",
  "com.beachape" %% "enumeratum" % "1.5.12",
  "com.beachape" %% "enumeratum-circe" % "1.5.12",
  "com.dripower" %% "play-circe" % "2609.0",
  "com.github.mpilquist" %% "simulacrum" % "0.11.0",
  "org.playframework.anorm" %% "anorm" % "2.6.0",
  "com.stripe" % "stripe-java" % "5.28.0",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.postgresql" % "postgresql" % "42.2.1",
  "org.typelevel" %% "cats-core" % "1.0.1",
  akkaHttpServer, // or use nettyServer for Netty
  logback, // add Play logging support
  jdbc
)

lazy val root = (project in file("."))
  .enablePlugins(PlayService)
  .enablePlugins(RoutesCompiler)