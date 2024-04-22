import sbt.Keys.{organization, publishTo, resolvers, scalaVersion, skip, updateOptions}
import sbtrelease.ReleaseStateTransformations._
import LibraryVersions._

import scala.sys.process._

val scalatest = "org.scalatest" %% "scalatest" % "3.2.18"

lazy val integrationTestSettings: Seq[Def.Setting[_]] = Defaults.itSettings ++ Seq(
  IntegrationTest / scalaSource := baseDirectory.value / "src" / "test" / "scala",
  IntegrationTest / javaSource := baseDirectory.value / "src" / "test" / "java",
  IntegrationTest / resourceDirectory := baseDirectory.value / "src" / "test" / "resources",
  Test / testOptions += Tests
    .Argument(TestFrameworks.ScalaTest, "-l", "com.gu.test.tags.annotations.IntegrationTest", "-oIS"),
  libraryDependencies += scalatest % "it",
)

lazy val scalafmtSettings = Seq(
  scalafmtFilter.withRank(KeyRanks.Invisible) := "diff-dirty",
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
    scalaVersion := "2.13.13",
    // https://www.scala-sbt.org/1.x/docs/Cached-Resolution.html
    updateOptions := updateOptions.value.withCachedResolution(true),
    resolvers ++= Resolver.sonatypeOssRepos("releases"), // libraries that haven't yet synced to maven central
    assembly / assemblyMergeStrategy := {
      case PathList("models", xs @ _*) => MergeStrategy.discard
      case x if x.endsWith("io.netty.versions.properties") => MergeStrategy.first
      case x if x.endsWith("git.properties") => MergeStrategy.discard
      case x if x.endsWith("module-info.class") => MergeStrategy.discard
      case "mime.types" => MergeStrategy.first
      case str if str.contains("simulacrum") => MergeStrategy.first
      case name if name.endsWith("execution.interceptors") => MergeStrategy.filterDistinctLines
      case PathList("javax", "annotation", _ @_*) => MergeStrategy.first
      case PathList("deriving.conf") => MergeStrategy.concat
      case y =>
        val oldStrategy = (assembly / assemblyMergeStrategy).value
        oldStrategy(y)
    },
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
  releaseTagName := s"${name.value}-${version.value}",
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
  "com.typesafe" % "config" % "1.4.3",
  scalatest % "test",
  "com.typesafe.scala-logging" % "scala-logging_2.13" % "3.9.5",
  "ch.qos.logback" % "logback-classic" % "1.5.6",
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
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    buildInfoOptions += BuildInfoOption.ToMap,
    scalacOptions += "-Ytasty-reader",
    scalafmtSettings,
  )
  .dependsOn(
    // Include tests from support-services, for use by PriceSummaryServiceSpec
    `support-services` % "compile->compile;test->test",
    `support-models`,
    `support-config`,
    `support-internationalisation`,
    `module-retry`,
  )
  .aggregate(
    `support-services`,
    `support-models`,
    `support-config`,
    `support-internationalisation`,
    `module-retry`,
  )

lazy val `support-workers` = (project in file("support-workers"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .configs(IntegrationTest)
  .settings(
    integrationTestSettings,
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
    scalacOptions += "-Ytasty-reader",
  )
  .dependsOn(
    `support-services` % "test->test;it->test;compile->compile",
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
  .settings(
    libraryDependencies ++= commonDependencies,
    releaseSettings,
    scalafmtSettings,
  )

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
    scalacOptions += "-Ytasty-reader",
    scalafmtSettings,
  )
  .dependsOn(
    `support-models`,
    `support-internationalisation`,
    `module-acquisition-events`,
    `supporter-product-data-dynamo`,
    `module-retry`,
  )
  .aggregate(
    `support-models`,
    `support-internationalisation`,
    `module-acquisition-events`,
    `supporter-product-data-dynamo`,
    `module-retry`,
  )

lazy val `support-models` = (project in file("support-models"))
  .configs(IntegrationTest)
  .settings(
    releaseSettings,
    integrationTestSettings,
    scalafmtSettings,
    scalacOptions += "-Ytasty-reader",
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
    scalacOptions += "-Ytasty-reader",
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
    scalacOptions += "-Ytasty-reader",
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

lazy val `module-retry` = (project in file("support-modules/retry"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    scalafmtSettings,
    libraryDependencies ++= commonDependencies,
  )

lazy val `module-acquisition-events` = (project in file("support-modules/acquisition-events"))
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype, AssemblyPlugin)
  .settings(
    scalafmtSettings,
    scalacOptions += "-Ytasty-reader",
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`support-config`, `module-aws`, `support-services`)

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

lazy val `it-test-runner` = (project in file("support-lambdas/it-test-runner"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .dependsOn(`module-aws`)

lazy val `acquisitions-firehose-transformer` = (project in file("support-lambdas/acquisitions-firehose-transformer"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    scalafmtSettings,
    scalacOptions += "-Ytasty-reader",
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-acquisition-events`)
  .aggregate(`module-acquisition-events`)

lazy val `acquisition-events-api` = (project in file("support-lambdas/acquisition-events-api"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    scalafmtSettings,
    scalacOptions += "-Ytasty-reader",
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-acquisition-events`, `module-aws`)
  .aggregate(`module-acquisition-events`)

lazy val `bigquery-acquisitions-publisher` = (project in file("support-lambdas/bigquery-acquisitions-publisher"))
  .enablePlugins(RiffRaffArtifact)
  .disablePlugins(ReleasePlugin, SbtPgp, Sonatype)
  .settings(
    scalafmtSettings,
    scalacOptions += "-Ytasty-reader",
    libraryDependencies ++= commonDependencies,
  )
  .dependsOn(`module-acquisition-events`, `module-aws`)
  .aggregate(`module-acquisition-events`)

lazy val `support-lambdas` = (project in file("support-lambdas"))
  .settings(scalafmtSettings)
  .aggregate(
    `stripe-intent`,
    `it-test-runner`,
    `acquisitions-firehose-transformer`,
    `acquisition-events-api`,
    `bigquery-acquisitions-publisher`,
  )
