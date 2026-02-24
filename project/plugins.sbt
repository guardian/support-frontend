logLevel := Level.Warn

addSbtPlugin("com.github.sbt" % "sbt-release" % "1.4.0")

addSbtPlugin("com.github.sbt" % "sbt-pgp" % "2.3.1")

addSbtPlugin("org.xerial.sbt" % "sbt-sonatype" % "3.12.2")

addSbtPlugin(
  "org.playframework" % "sbt-plugin" % "3.0.10",
) // when updating major version, also update play-circe version

addSbtPlugin("com.github.sbt" % "sbt-digest" % "2.1.0")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.11.0")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "2.1.5")

libraryDependencies += "org.vafer" % "jdeb" % "1.10" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.6")

addSbtPlugin("ch.epfl.scala" % "sbt-scalafix" % "0.14.5")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "1.11.7")
//Fix for sbt-native-packager 1.9.11 upgrade errors
ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always

// needed for riffraff as it uses AWS S3 SDK 1.11 which uses some base64 methods that were removed in JDK11
// this is not needed for the current build server, but it is a good reason to move to AWS SDK v2
libraryDependencies += "javax.xml.bind" % "jaxb-api" % "2.3.1"
