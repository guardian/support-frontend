logLevel := Level.Warn

addSbtPlugin("com.github.gseitz" % "sbt-release" % "1.0.11")

addSbtPlugin("com.jsuereth" % "sbt-pgp" % "1.1.2-1")

addSbtPlugin("org.xerial.sbt" % "sbt-sonatype" % "2.6")

addSbtPlugin(
  "com.typesafe.play" % "sbt-plugin" % "2.8.16",
) // when updating major version, also update play-circe version

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.4")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.7.0")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.5")

libraryDependencies += "org.vafer" % "jdeb" % "1.10" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.4.6")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "1.8.1")

// needed for riffraff as it uses AWS S3 SDK 1.11 which uses some base64 methods that were removed in JDK11
// this is not needed for the current build server, but it is a good reason to move to AWS SDK v2
libraryDependencies += "javax.xml.bind" % "jaxb-api" % "2.3.1"
