import SeleniumTestConfig._

version := "1.0-SNAPSHOT"

packageSummary := "Support Play APP"

testOptions in SeleniumTest := Seq(Tests.Filter(seleniumTestFilter))

testOptions in Test := Seq(Tests.Filter(unitTestFilter))

import LibraryVersions.{circeVersion, awsClientVersion, jacksonVersion}

resolvers += "Guardian Platform Bintray" at "https://dl.bintray.com/guardian/platforms"

libraryDependencies ++= Seq(
  "com.typesafe" % "config" % "1.3.2",
  "com.gu" %% "simple-configuration-ssm" % "1.5.1",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test",
  "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test,
  "org.mockito" % "mockito-core" % "2.11.0" % Test,
  "io.sentry" % "sentry-logback" % "1.7.5",
  "com.amazonaws" % "aws-java-sdk-kms" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sts" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "org.typelevel" %% "cats-core" % "1.0.1",
  "com.dripower" %% "play-circe" % "2609.1",
  "com.gu" %% "fezziwig" % "0.8",
  "com.typesafe.akka" %% "akka-agent" % "2.5.14",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "joda-time" % "joda-time" % "2.9.9",
  "com.gu.identity" %% "identity-play-auth" % "2.6-SNAPSHOT",
  "com.gu" %% "identity-test-users" % "0.6",
  "com.google.guava" % "guava" % "25.0-jre",
  "com.netaporter" %% "scala-uri" % "0.4.16",
  "com.gu" %% "play-googleauth" % "0.7.6",
  "io.github.bonigarcia" % "webdrivermanager" % "3.3.0" % "test",
  "org.seleniumhq.selenium" % "selenium-java" % "3.8.1" % "test",
  "com.squareup.okhttp3" % "okhttp" % "3.9.0",
  "com.gocardless" % "gocardless-pro" % "2.8.0",
  "com.gu" %% "tip" % "0.5.1",
  "com.googlecode.libphonenumber" % "libphonenumber" % "8.10.4",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  filters,
  ws
)

sources in(Compile, doc) := Seq.empty

publishArtifact in(Compile, packageDoc) := false

enablePlugins(SystemdPlugin)

debianPackageDependencies := Seq("openjdk-8-jre-headless")

packageSummary := "Support Frontend Play App"
packageDescription := """Frontend for the new supporter platform"""
maintainer := "Membership <membership.dev@theguardian.com>"

riffRaffPackageType := (packageBin in Debian).value
riffRaffManifestProjectName := "support:frontend-mono"
riffRaffPackageName := "frontend"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("support-frontend/cloud-formation/cfn.yaml"), "cfn/cfn.yaml")

def getFiles(f: File): Seq[(File, String)] = {
  f match {
    case file if file.isFile => Seq((file, file.toString.replace("support-frontend/", "")))
    case dir if dir.isDirectory => dir.listFiles.toSeq.flatMap(getFiles)
  }
}

riffRaffArtifactResources ++= getFiles(file("support-frontend/storybook-static"))

javaOptions in Universal ++= Seq(
  "-Dpidfile.path=/dev/null",
  "-J-XX:MaxRAMFraction=2",
  "-J-XX:InitialRAMFraction=2",
  "-J-XX:MaxMetaspaceSize=500m",
  "-J-XX:+PrintGCDetails",
  "-J-XX:+PrintGCDateStamps",
  s"-J-Xloggc:/var/log/${packageName.value}/gc.log"
)

javaOptions in Test += "-Dconfig.file=test/selenium/conf/selenium-test.conf"

addCommandAlias("devrun", "run 9210") // Chosen to not clash with other Guardian projects - we can't all use the Play default of 9000!
