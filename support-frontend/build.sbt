import LibraryVersions._

version := "1.0-SNAPSHOT"

packageSummary := "Support Play APP"

libraryDependencies ++= Seq(
  "com.typesafe" % "config" % "1.4.5",
  "com.gu" %% "simple-configuration-ssm" % "7.0.0",
  "org.mockito" % "mockito-core" % "2.28.2" % Test,
  "io.sentry" % "sentry-logback" % "6.29.0",
  "software.amazon.awssdk" % "sfn" % awsClientVersion2,
  "software.amazon.awssdk" % "sts" % awsClientVersion2,
  "software.amazon.awssdk" % "s3" % awsClientVersion2,
  "software.amazon.awssdk" % "lambda" % awsClientVersion2,
  "software.amazon.awssdk" % "dynamodb" % awsClientVersion2,
  "org.typelevel" %% "cats-core" % catsVersion,
  "com.dripower" %% "play-circe" % playCirceVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % "0.14.4",
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-optics" % "0.14.1",
  "joda-time" % "joda-time" % "2.9.9",
  "com.gu.identity" %% "identity-auth-play" % "4.12",
  "com.okta.jwt" % "okta-jwt-verifier" % oktaJwtVerifierVersion,
  "com.okta.jwt" % "okta-jwt-verifier-impl" % oktaJwtVerifierVersion % Runtime,
  "com.gu" %% "identity-test-users" % "0.10.2",
  "com.google.guava" % "guava" % "32.1.3-jre",
  "com.indoorvivants" %% "scala-uri" % scalaUriVersion,
  "com.gu.play-googleauth" %% "play-v30" % "8.0.1",
  "org.scalatestplus" %% "scalatestplus-mockito" % "1.0.0-M2" % Test,
  "com.squareup.okhttp3" % "okhttp" % "4.12.0",
  "com.gocardless" % "gocardless-pro" % "2.10.0",
  "com.googlecode.libphonenumber" % "libphonenumber" % "8.13.55",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % jacksonVersion,
  filters,
  ws,
)
dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion
dependencyOverrides += "commons-io" % "commons-io" % "2.21.0" % Test

excludeDependencies ++= Seq(
  // Exclude htmlunit due to a vulnerability. Brought in via org.scalatestplus.play:scalatestplus-play but we don't need
  // it. The vulnerability is fixed in v3 onwards, but the lib was renamed so I don't think we can force a newer version
  // by specifying is in the dependencies.
  ExclusionRule("net.sourceforge.htmlunit", "htmlunit"),
  ExclusionRule("commons-beanutils", "commons-beanutils"), // Also exclude commons-beanutils due to a vulnerability
  // This exclusion is needed until we upgrade identity-auth-play to a version which doesn't pull in an older play and
  // therefore an older version of lz4. The later version of lz4 pulled in by Play 3.0.10 will be used instead.
  ExclusionRule("org.lz4"),
)

ThisBuild / libraryDependencySchemes ++= Seq(
  "org.scala-lang.modules" %% "scala-xml" % VersionScheme.Always,
)

Compile / doc / sources := Seq.empty

Compile / packageDoc / publishArtifact := false

enablePlugins(SystemdPlugin)

packageSummary := "Support Frontend Play App"
packageDescription := """Frontend for the new supporter platform"""
maintainer := "Membership <membership.dev@theguardian.com>"

riffRaffPackageType := (Debian / packageBin).value
riffRaffManifestProjectName := "support:frontend-mono"
riffRaffPackageName := "frontend"
riffRaffAwsCredentialsProfile := Some("membership") // needed when running locally
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("cdk/cdk.out/Frontend-PROD.template.json"), "cfn/Frontend-PROD.template.json")
riffRaffArtifactResources += (file("cdk/cdk.out/Frontend-CODE.template.json"), "cfn/Frontend-CODE.template.json")
riffRaffArtifactResources ++= getFiles(file("support-frontend/public/compiled-assets"), "assets-static")

def getFiles(rootFile: File, deployName: String): Seq[(File, String)] = {
  def getFiles0(f: File): Seq[(File, String)] = {
    f match {
      case file if file.isFile => Seq((file, file.toString.replace(rootFile.getPath, deployName)))
      case dir if dir.isDirectory => dir.listFiles.toSeq.flatMap(getFiles0)
    }
  }
  getFiles0(rootFile)
}

val jvmParameters = Def.setting(
  Seq(
    "-XX:MaxMetaspaceSize=256m",
    s"-Xlog:gc*:/var/log/${packageName.value}/gc.log", // https://docs.azul.com/prime/Unified-GC-Logging#enabling-unified-gc-logging
    "-XX:-OmitStackTraceInFastThrow",
  ),
)
val playParameters = Seq(
  "-Dpidfile.path=/dev/null", // https://www.playframework.com/documentation/3.0.x/ProductionConfiguration#Changing-the-path-of-RUNNING_PID
)
// -J tells the packager to pass it through to the JVM
// https://www.scala-sbt.org/sbt-native-packager/archetypes/java_app/customize.html#via-build-sbt
Universal / javaOptions ++= playParameters ++ jvmParameters.value.map(param => "-J" + param)

addCommandAlias(
  "devrun",
  "run 9210",
) // Chosen to not clash with other Guardian projects - we can't all use the Play default of 9000!
