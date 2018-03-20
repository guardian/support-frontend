addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.6.12")
addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.4")
addSbtPlugin("net.virtual-void" % "sbt-dependency-graph" % "0.9.0")
libraryDependencies += "org.vafer" % "jdeb" % "1.5" artifacts (Artifact("jdeb", "jar", "jar"))
