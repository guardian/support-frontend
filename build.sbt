import Dependencies._
import sbt.Keys.libraryDependencies

lazy val `support-workers` =
  project.in(file("."))
    .aggregate(common, `monthly-contributions`)

lazy val common = project
  .settings(
    name := "guardian-support-common",
    description := "Common code for the support-workers project",
    libraryDependencies ++= commonDependencies
  )
  .settings(Settings.shared: _*)

lazy val `monthly-contributions` = project
  .settings(
    name := "guardian-support-monthly-contributions-lambdas",
    description := "AWS Lambdas providing implementations of the Monthly Contribution supporter flow for orchestration by step function",
    riffRaffPackageName := "guardian-support-monthly-contributions-lambdas",
    riffRaffPackageType := (packageBin in Universal).value,
    libraryDependencies ++= monthlyContributionsDependencies
  )
  .settings(Settings.shared: _*)
  .dependsOn(common)
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
