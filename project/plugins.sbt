addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "0.9.5")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.1.1")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.3")

addSbtPlugin("com.typesafe.sbt" % "sbt-s3" % "0.9")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.7.0" excludeAll ExclusionRule(organization = "com.danieltrinh"))

addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.6.0")

addSbtPlugin("org.foundweekends" % "sbt-bintray" % "0.5.1")