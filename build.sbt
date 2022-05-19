import SeleniumTestConfig.SeleniumTest
import sbt.Keys.{organization, publishTo, resolvers, scalaVersion, skip, updateOptions}
import sbtrelease.ReleaseStateTransformations._
import LibraryVersions._

import scala.sys.process._

val scalatest = "org.scalatest" %% "scalatest" % "3.2.2"

lazy val integrationTestSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
  IntegrationTest / scalaSource := baseDirectory.value / "src" / "test" / "scala",
  IntegrationTest / javaSource := baseDirectory.value / "src" / "test" / "java",
  IntegrationTest / resourceDirectory := baseDirectory.value / "src" / "test" / "resources",
  Test / testOptions += Tests
    .Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest", "-oI"),
  libraryDependencies += scalatest % "it",
)

lazy val scalafmtSettings = Seq(
  (Test / test) := ((Test / test) dependsOn (Test / scalafmtCheckAll)).value,
  (Test / testOnly) := ((Test / testOnly) dependsOn (Test / scalafmtCheckAll)).evaluated,
  (Test / testQuick) := ((Test / testQuick) dependsOn (Test / scalafmtCheckAll)).evaluated,
)

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
  pushChanges,
)

inThisBuild(
  Seq(
    organization := "com.gu",
    scalaVersion := "2.13.8",
    // https://www.scala-sbt.org/1.x/docs/Cached-Resolution.html
    updateOptions := updateOptions.value.withCachedResolution(true),
    resolvers ++= Seq(Resolver.sonatypeRepo("releases")), // libraries that haven't yet synced to maven central
  ),
)

lazy val releaseSettings = Seq(
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
  scmInfo := Some(
    ScmInfo(
      url("https://github.com/guardian/support-frontend"),
      "scm:git:git@github.com:guardian/support-frontend.git",
    ),
  ),
)

lazy val commonDependencies = Seq(
  "com.typesafe" % "config" % "1.3.2",
  scalatest % "test",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
)

lazy val root = (project in file("."))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    name := "support-frontend-root",
    moduleName := "support-frontend-root",
    publish / skip := true,
  )
  .aggregate(
    `support-frontend`,
    `support-workers`,
    `supporter-product-data`,
    `supporter-product-data-dynamo`,
    `stripe-patrons-data`,
    `support-models`,
    `support-config`,
    `support-internationalisation`,
    `support-services`,
    `stripe-intent`,
    `support-redemptiondb`,
    `it-test-runner`,
    `module-aws`,
    `module-acquisition-events`,
    `module-rest`,
    `support-payment-api`,
    `acquisitions-firehose-transformer`,
    `support-lambdas`,
  )

lazy val `support-frontend` = (project in file("support-frontend"))
  .enablePlugins(PlayScala, BuildInfoPlugin, RiffRaffArtifact, JDebPackaging)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(SeleniumTest, IntegrationTest)
  .settings(
    integrationTestSettings,
    inConfig(SeleniumTest)(Defaults.testTasks),
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    scalafmtSettings,
  )
  .dependsOn(
    // Include tests from support-services, for use by PriceSummaryServiceSpec
    `support-services` % "compile->compile;test->test",
    `support-models`,
    `support-config`,
    `support-internationalisation`
  )
  .aggregate(`support-services`, `support-models`, `support-config`, `support-internationalisation`)

lazy val `support-workers` = (project in file("support-workers"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(
    `support-services`,
    `support-models` % "test->test;it->test;compile->compile",
    `support-config`,
    `support-internationalisation`,
    `module-acquisition-events`,
    `supporter-product-data-dynamo`,
  )
  .aggregate(
    `support-services`,
    `support-models`,
    `support-config`,
    `support-internationalisation`,
    `supporter-product-data-dynamo`,
  )

lazy val `supporter-product-data` = (project in file("supporter-product-data"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-rest`, `module-aws`, `supporter-product-data-dynamo`)
  .aggregate(`module-rest`, `module-aws`, `supporter-product-data-dynamo`)

lazy val `supporter-product-data-dynamo` = (project in file("support-modules/supporter-product-data-dynamo"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    libraryDependencies ++= commonDependencies,
    scalafmtSettings,
  )
  .dependsOn(`module-aws`)
  .aggregate(`module-aws`)

lazy val `stripe-patrons-data` = (project in file("stripe-patrons-data"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-rest`, `module-aws`, `supporter-product-data-dynamo`)
  .aggregate(`module-rest`, `module-aws`, `supporter-product-data-dynamo`)

lazy val `support-payment-api` = (project in file("support-payment-api"))
  .enablePlugins(RiffRaffArtifact, SystemdPlugin, PlayService, RoutesCompiler, JDebPackaging, BuildInfoPlugin)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    libraryDependencies ++= commonDependencies,
    scalafmtSettings,
  )
  .dependsOn(`support-models`, `support-internationalisation`, `module-acquisition-events`)
  .aggregate(`support-models`, `support-internationalisation`, `module-acquisition-events`)

lazy val `support-models` = (project in file("support-models"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`support-internationalisation`)
  .aggregate(`support-internationalisation`)

lazy val `support-config` = (project in file("support-config"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`support-models`, `support-internationalisation`)
  .aggregate(`support-models`, `support-internationalisation`)

lazy val `support-services` = (project in file("support-services"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`support-internationalisation`, `support-models`, `support-config`, `module-rest`, `module-aws`)
  .aggregate(`support-internationalisation`, `support-models`, `support-config`, `module-rest`, `module-aws`)

lazy val `module-rest` = (project in file("support-modules/rest"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )

lazy val `module-aws` = (project in file("support-modules/aws"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )

lazy val `module-acquisition-events` = (project in file("support-modules/acquisition-events"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`support-config`)

lazy val `support-internationalisation` = (project in file("support-internationalisation"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )

lazy val `stripe-intent` = (project in file("support-lambdas/stripe-intent"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-rest`, `support-config`, `module-aws`)
  .aggregate(`module-rest`, `support-config`, `module-aws`)

lazy val `support-redemptiondb` = (project in file("support-redemptiondb"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)

lazy val `it-test-runner` = (project in file("support-lambdas/it-test-runner"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .dependsOn(`module-aws`)

lazy val `acquisitions-firehose-transformer` = (project in file("support-lambdas/acquisitions-firehose-transformer"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-acquisition-events`)
  .aggregate(`module-acquisition-events`)

lazy val `acquisition-events-api` = (project in file("support-lambdas/acquisition-events-api"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-acquisition-events`, `module-aws`)
  .aggregate(`module-acquisition-events`)

lazy val `support-lambdas` = (project in file("support-lambdas"))
  .settings(scalafmtSettings)
  .aggregate(`stripe-intent`, `it-test-runner`, `acquisitions-firehose-transformer`, `acquisition-events-api`)
