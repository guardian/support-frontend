name := "payment-api"

version := "0.1"

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