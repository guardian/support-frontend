name := "payment-api"

version := "0.1"
scalaVersion := "2.12.4"
scalacOptions += "-Ypartial-unification"

val circeVersion = "0.9.1"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "org.typelevel" %% "cats-core" % "1.0.1",
  "com.dripower" %% "play-circe" % "2609.0",
  "com.stripe" % "stripe-java" % "5.28.0",
  akkaHttpServer, // or use nettyServer for Netty
  logback // add Play logging support
)

lazy val root = (project in file("."))
  .enablePlugins(PlayService)
  .enablePlugins(RoutesCompiler)