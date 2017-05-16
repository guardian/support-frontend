addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.5.9")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.0")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.6.1")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.2")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.7.0" excludeAll ExclusionRule(organization = "com.danieltrinh"))

addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.6.0")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "0.9.7")