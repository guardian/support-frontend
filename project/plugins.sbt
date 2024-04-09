logLevel := Level.Warn

addSbtPlugin("com.github.sbt" % "sbt-release" % "1.1.0")

addSbtPlugin("com.github.sbt" % "sbt-pgp" % "2.2.1")

addSbtPlugin("org.xerial.sbt" % "sbt-sonatype" % "3.9.21")

addSbtPlugin(
  "org.playframework" % "sbt-plugin" % "3.0.1",
) // when updating major version, also update play-circe version

addSbtPlugin("com.github.sbt" % "sbt-digest" % "2.0.0")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.12.0")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "2.1.1")

libraryDependencies += "org.vafer" % "jdeb" % "1.10" artifacts (Artifact("jdeb", "jar", "jar"))

addSbtPlugin("org.scalameta" % "sbt-scalafmt" % "2.5.2")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "1.9.16")
//Fix for sbt-native-packager 1.9.11 upgrade errors
ThisBuild / libraryDependencySchemes += "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always

// needed for riffraff as it uses AWS S3 SDK 1.11 which uses some base64 methods that were removed in JDK11
// this is not needed for the current build server, but it is a good reason to move to AWS SDK v2
libraryDependencies += "javax.xml.bind" % "jaxb-api" % "2.3.1"
