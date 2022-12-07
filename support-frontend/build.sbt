import SeleniumTestConfig._
import LibraryVersions._

version := "1.0-SNAPSHOT"

packageSummary := "Support Play APP"

SeleniumTest / testOptions := Seq(Tests.Filter(seleniumTestFilter))

Test / testOptions ++= Seq(Tests.Filter(unitTestFilter))

libraryDependencies ++= Seq(
  "com.typesafe" % "config" % "1.4.2",
  "com.gu" %% "simple-configuration-ssm" % "1.5.7",
  "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test,
  "org.mockito" % "mockito-core" % "2.28.2" % Test,
  "io.sentry" % "sentry-logback" % "6.9.1",
  "com.amazonaws" % "aws-java-sdk-stepfunctions" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-sts" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-s3" % awsClientVersion,
  "com.amazonaws" % "aws-java-sdk-lambda" % awsClientVersion,
  "org.typelevel" %% "cats-core" % catsVersion,
  "com.dripower" %% "play-circe" % playCirceVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-optics" % circeVersion,
  "joda-time" % "joda-time" % "2.9.9",
  "com.gu.identity" %% "identity-auth-play" % "3.255",
  "com.gu" %% "identity-test-users" % "0.8",
  "com.google.guava" % "guava" % "31.1-jre",
  "io.lemonlabs" %% "scala-uri" % scalaUriVersion,
  "com.gu.play-googleauth" %% "play-v28" % "2.2.6",
  "io.github.bonigarcia" % "webdrivermanager" % "3.8.1" % "test",
  "org.seleniumhq.selenium" % "selenium-java" % "4.7.1" % "test",
  "org.scalatestplus" %% "scalatestplus-mockito" % "1.0.0-M2" % Test,
  "org.scalatestplus" %% "scalatestplus-selenium" % "1.0.0-M2" % Test,
  "com.squareup.okhttp3" % "okhttp" % "3.14.9",
  "com.gocardless" % "gocardless-pro" % "2.10.0",
  "com.googlecode.libphonenumber" % "libphonenumber" % "8.12.57",
  // This is required to force aws libraries to use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % jacksonVersion,
  filters,
  ws,
)
dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonDatabindVersion

Compile / doc / sources := Seq.empty

Compile / packageDoc / publishArtifact := false

enablePlugins(SystemdPlugin)

debianPackageDependencies := Seq("openjdk-8-jre-headless")

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

Universal / javaOptions ++= Seq(
  "-Dpidfile.path=/dev/null",
  "-J-XX:MaxMetaspaceSize=256m",
  "-J-XX:+PrintGCDetails",
  "-J-XX:+PrintGCDateStamps",
  s"-J-Xloggc:/var/log/${packageName.value}/gc.log",
)

Test / javaOptions += "-Dconfig.file=test/selenium/conf/selenium-test.conf"

addCommandAlias(
  "devrun",
  "run 9210",
) // Chosen to not clash with other Guardian projects - we can't all use the Play default of 9000!
