import sbt.Keys.{publishTo, resolvers, scalaVersion}
import SeleniumTestConfig.{SeleniumTest, seleniumTestFilter, unitTestFilter}
import sbtrelease.ReleaseStateTransformations._

skip in publish := true

lazy val integrationTestSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
  scalaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "scala",
  javaSource in IntegrationTest := baseDirectory.value / "src" / "test" / "java",
  resourceDirectory in IntegrationTest := baseDirectory.value / "src" / "test" / "resources",
  testOptions in Test := Seq(Tests.Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest"))
)

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val release = Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  ReleaseStep(action = Command.process("publishSigned", _), enableCrossBuild = false),
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _), enableCrossBuild = false),
  setNextVersion,
  commitNextVersion,
  pushChanges
)

lazy val commonSettings = Seq(
  organization := "com.gu",
  scalaVersion := "2.12.10",
  resolvers ++= Seq(Resolver.sonatypeRepo("releases"), Resolver.bintrayRepo("guardian", "ophan")),
  isSnapshot := false,
  publishTo := {
    val nexus = "https://oss.sonatype.org/"
    if (isSnapshot.value)
      Some("snapshots" at nexus + "content/repositories/snapshots")
    else
      Some("releases" at nexus + "service/local/staging/deploy/maven2")
  },
  licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html")),
  releaseProcess := release,
  releaseUseGlobalVersion := false,
  releaseVersionFile := file(name.value + "/version.sbt"),
  scmInfo := Some(ScmInfo(
    url("https://github.com/guardian/support-frontend"),
    "scm:git:git@github.com:guardian/support-frontend.git"
  )),
  // https://www.scala-sbt.org/1.x/docs/Cached-Resolution.html
  updateOptions := updateOptions.value.withCachedResolution(true),
  dependencyStats / aggregate := false
)

lazy val commonDependencies = Seq(
  "com.typesafe" % "config" % "1.3.2",
  "org.scalatest" %% "scalatest" % "3.0.5" % "it, test"
)

lazy val root = (project in file("."))
  .aggregate(
    `support-frontend`,
    `support-workers`,
    `support-models`,
    `support-config`,
    `support-internationalisation`,
    `support-services`,
    `stripe-intent`
  )

lazy val `support-frontend` = (project in file("support-frontend"))
  .enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging)
  .configs(SeleniumTest)
  .settings(
    inConfig(SeleniumTest)(Defaults.testTasks),
    commonSettings,
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    scalastyleFailOnError := true,
    testScalastyle := scalastyle.in(Compile).toTask("").value,
    (test in Test) := ((test in Test) dependsOn testScalastyle).value,
    (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
    (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated,
  ).dependsOn(`support-services`, `support-models`, `support-config`, `support-internationalisation`)
  .aggregate(`support-services`, `support-models`, `support-config`, `support-internationalisation`)

lazy val `support-workers` = (project in file("support-workers"))
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-services`, `support-models` % "test->test;it->test;compile->compile", `support-config`, `support-internationalisation`)
  .aggregate(`support-services`, `support-models`, `support-config`, `support-internationalisation`)


lazy val `support-models` = (project in file("support-models"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-internationalisation`)
  .aggregate(`support-internationalisation`)

lazy val `support-config` = (project in file("support-config"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-models`, `support-internationalisation`)
  .aggregate(`support-models`, `support-internationalisation`)

lazy val `support-services` = (project in file("support-services"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  ).dependsOn(`support-internationalisation`, `support-models`, `support-config`, `support-rest`)
  .aggregate(`support-internationalisation`, `support-models`, `support-config`, `support-rest`)

lazy val `support-rest` = (project in file("support-rest"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  )

lazy val `support-internationalisation` = (project in file("support-internationalisation"))
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies
  )

lazy val `stripe-intent` = (project in file("support-lambdas/stripe-intent"))
  .enablePlugins(RiffRaffArtifact)
  .configs(IntegrationTest)
  .settings(
    commonSettings,
    integrationTestSettings,
    libraryDependencies ++= commonDependencies,
  ).dependsOn(`support-rest`, `support-config`)
