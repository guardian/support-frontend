addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.12")
addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.4")
addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.9.0")
addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.8.0")
addSbtPlugin("com.typesafe.sbt" % "sbt-git" % "0.9.3")
addSbtPlugin("org.scoverage" % "sbt-scoverage" % "1.5.1")

libraryDependencies += "org.vafer" % "jdeb" % "1.10" artifacts (Artifact("jdeb", "jar", "jar"))
