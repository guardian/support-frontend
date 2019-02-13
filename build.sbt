import sbt.Keys.{publishTo, resolvers, scalaVersion}
import scala.sys.process._
import SeleniumTestConfig.SeleniumTest

skip in publish := true

def env(key: String, default: String): String = Option(System.getenv(key)).getOrElse(default)

def commitId(): String = try {
  "git rev-parse HEAD".!!.trim
} catch {
  case _: Exception => "unknown"
}

lazy val testSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
  scalaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "scala",
  javaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "java",
  testOptions in Test := Seq(Tests.Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest"))
)

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val commonSettings = Seq(
  organization := "com.gu",
  scalaVersion := "2.12.7",
  resolvers ++= Seq(Resolver.sonatypeRepo("releases"), Resolver.bintrayRepo("guardian", "ophan")),
  publishTo := {
    val nexus = "https://oss.sonatype.org/"
    if (isSnapshot.value)
      Some("snapshots" at nexus + "content/repositories/snapshots")
    else
      Some("releases" at nexus + "service/local/staging/deploy/maven2")
  },
  licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html")),
)

lazy val commonDependencies = Seq(
  "com.typesafe" % "config" % "1.3.2",
  "org.scalatest" %% "scalatest" % "3.0.5" % "it, test"
)

lazy val root = (project in file("."))
  .aggregate(`support-frontend`, `support-workers`, `support-models`, `support-config`, `support-internationalisation`, `support-services`)


lazy val `support-frontend` = (project in file("support-frontend"))
  .enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging)
  .configs(IntegrationTest, SeleniumTest)
  .settings(
    commonSettings,
    libraryDependencies ++= commonDependencies,
    buildInfoKeys := Seq[BuildInfoKey](
      name,
      BuildInfoKey.constant("buildNumber", env("BUILD_NUMBER", "DEV")),
      BuildInfoKey.constant("buildTime", System.currentTimeMillis),
      BuildInfoKey.constant("gitCommitId", Option(System.getenv("BUILD_VCS_NUMBER")) getOrElse commitId())
    ),
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    scalastyleFailOnError := true,
    testScalastyle := scalastyle.in(Compile).toTask("").value,
    (test in Test) := ((test in Test) dependsOn testScalastyle).value,
    (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
    (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated
  ).dependsOn(`support-services`, `support-models`, `support-config`, `support-internationalisation`)

lazy val `support-workers` = (project in file("support-workers"))
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    testSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-services`, `support-models`, `support-config`, `support-internationalisation`)


lazy val `support-models` = (project in file("support-models"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    testSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-internationalisation`)

lazy val `support-config` = (project in file("support-config"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    testSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-models`, `support-internationalisation`)

lazy val `support-services` = (project in file("support-services"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    testSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-internationalisation`, `support-models`, `support-config`)

lazy val `support-internationalisation` = (project in file("support-internationalisation"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    testSettings,
    libraryDependencies ++= commonDependencies
  )
