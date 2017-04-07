name := "frontend"

version := "1.0-SNAPSHOT"

scalaVersion := "2.11.8"

def env(key: String, default: String): String = Option(System.getenv(key)).getOrElse(default)

lazy val root = (project in file(".")).enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging).settings(
  buildInfoKeys := Seq[BuildInfoKey](
    name,
    BuildInfoKey.constant("buildNumber", env("BUILD_NUMBER", "DEV")),
    BuildInfoKey.constant("buildTime", System.currentTimeMillis),
    BuildInfoKey.constant("gitCommitId", Option(System.getenv("BUILD_VCS_NUMBER")) getOrElse(try {
      "git rev-parse HEAD".!!.trim
    } catch {
      case e: Exception => "unknown"
    }))
  ),
  buildInfoPackage := "app",
  buildInfoOptions += BuildInfoOption.ToMap
)

libraryDependencies ++= Seq(
  "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test
)

sources in (Compile,doc) := Seq.empty

publishArtifact in (Compile, packageDoc) := false

import com.typesafe.sbt.packager.archetypes.ServerLoader.Systemd

serverLoading in Debian := Systemd

debianPackageDependencies := Seq("openjdk-8-jre-headless")

packageSummary := "Support Frontend Play App"
packageDescription := """Frontend for the new supporter platform"""
maintainer := "Membership <membership.dev@theguardian.com>"

riffRaffPackageType := (packageBin in Debian).value
riffRaffManifestProjectName := s"support:${name.value}"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("cloud-formation/cfn.yaml"), "cfn/cfn.yaml")

javaOptions in Universal ++= Seq(
  "-Dpidfile.path=/dev/null",
  "-J-XX:MaxRAMFraction=2",
  "-J-XX:InitialRAMFraction=2",
  "-J-XX:MaxMetaspaceSize=500m",
  "-J-XX:+PrintGCDetails",
  "-J-XX:+PrintGCDateStamps",
  s"-J-Xloggc:/var/log/${packageName.value}/gc.log"
)