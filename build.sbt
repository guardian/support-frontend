name := "payment-api"

version := "0.1"

val circeVersion = "0.9.1"

libraryDependencies ++= Seq(
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion
)

lazy val root = (project in file("."))
  .enablePlugins(PlayService)
  .enablePlugins(RoutesCompiler)
  .settings(
    scalaVersion := "2.12.4",
    libraryDependencies ++= Seq(
      akkaHttpServer, // or use nettyServer for Netty
      logback // add Play logging support
    )
  )