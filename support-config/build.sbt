name := "support-config"

description := "Scala library to provide shared configuration to Guardian Support projects."

version in ThisBuild := "0.18-SNAPSHOT"

libraryDependencies ++= Seq(
  "com.gu" %% "support-internationalisation" % "0.12",
  "com.gu" %% "support-models" % "0.52",
)
