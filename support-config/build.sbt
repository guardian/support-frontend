name := "support-config"

description := "Scala library to provide shared configuration to Guardian Support projects."

scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/support-config"),
  "scm:git:git@github.com:guardian/support-config.git"
))

libraryDependencies ++= Seq(
  "com.gu" %% "support-models" % "0.39",
  "com.gu" %% "support-internationalisation" % "0.9" % "provided"
)
