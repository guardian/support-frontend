name := "payment-api"

version := "0.1"

lazy val root = (project in file("."))
  .enablePlugins(PlayService)
  .enablePlugins(RoutesCompiler) // place routes in src/main/resources, or remove if using SIRD/RoutingDsl
  .settings(
    scalaVersion := "2.12.4",
    libraryDependencies ++= Seq(
      guice, // remove if not using Play's Guice loader
      akkaHttpServer, // or use nettyServer for Netty
      logback // add Play logging support
    )
  )