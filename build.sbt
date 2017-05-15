import Dependencies._
import com.typesafe.sbt.SbtScalariform.ScalariformKeys
import sbt.Keys.libraryDependencies

import scalariform.formatter.preferences.SpacesAroundMultiImports

lazy val testScalastyle = taskKey[Unit]("testScalastyle")

lazy val scalaStyleSettings = Seq(
    scalastyleFailOnError := true,
    testScalastyle := org.scalastyle.sbt.ScalastylePlugin.scalastyle.in(Compile).toTask("").value,
    (test in Test) := ((test in Test) dependsOn testScalastyle).value,
    (testOnly in Test) := ((testOnly in Test) dependsOn testScalastyle).evaluated,
    (testQuick in Test) := ((testQuick in Test) dependsOn testScalastyle).evaluated,
    ScalariformKeys.preferences := ScalariformKeys.preferences.value
      .setPreference(SpacesAroundMultiImports, false)
)

lazy val root =
  project.in(file("."))
    .settings(
      name := "support-workers"
    )
    .aggregate(common, `monthly-contributions`)

lazy val common = project
  .settings(
    name := "guardian-support-common",
    description := "Common code for the support-workers project",
    libraryDependencies ++= commonDependencies,
    scalaStyleSettings
  )
  .settings(Settings.shared: _*)

lazy val `monthly-contributions` = project
  .in(file("monthly-contributions"))
  .enablePlugins(JavaAppPackaging, RiffRaffArtifact)
  .settings(
    name := "monthly-contributions",
    description := "AWS Lambdas providing implementations of the Monthly Contribution supporter flow for orchestration by step function",
    riffRaffPackageType := assembly.value,
    riffRaffManifestProjectName := s"support:${name.value}",
    riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch"),
    riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV"),
    riffRaffManifestVcsUrl  := "git@github.com/guardian/support-workers.git",
    riffRaffUploadArtifactBucket := Option("riffraff-artifact"),
    riffRaffUploadManifestBucket := Option("riffraff-builds"),
    riffRaffArtifactResources += (file("cloud-formation/target/cfn.yaml"), "cfn/cfn.yaml"),
    assemblyJarName := s"${name.value}.jar",
    libraryDependencies ++= monthlyContributionsDependencies,
    scalaStyleSettings
  )
  .settings(Settings.shared: _*)
  .dependsOn(common % "compile->compile;test->test")
