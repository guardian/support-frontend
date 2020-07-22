import scala.sys.process._
import LibraryVersions._
import com.gu.riffraff.artifact.RiffRaffArtifact.autoImport.riffRaffManifestProjectName
import sbt.Keys.{libraryDependencies, resolvers}

version := "0.1-SNAPSHOT"
scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked", "-target:jvm-1.8", "-Xfatal-warnings")

libraryDependencies ++= Seq(
  "org.scalatest" %% "scalatest" % "3.2.0" // not a "Test" dependency, it's an actual one
)

riffRaffPackageType := assembly.value
riffRaffManifestProjectName := s"support:it-test-runner"
riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch")
riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV")
riffRaffManifestVcsUrl := "git@github.com/guardian/support-frontend.git"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("support-lambdas/it-test-runner/cfn.yaml"), "cfn/cfn.yaml")
assemblyJarName := s"${name.value}.jar"
