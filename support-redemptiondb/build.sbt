name := "support-redemptiondb"
description := "packages the database cfn for the redemption code db"

assemblyJarName := "dummy.jar"
riffRaffPackageType := new File("dummy.jar")
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffManifestProjectName := "support:db:redemptiondb"
riffRaffArtifactResources += (file("support-redemptiondb/cfn.yaml"), "cfn/cfn.yaml")
riffRaffManifestBranch := Option(System.getenv("BRANCH_NAME")).getOrElse("unknown_branch")
riffRaffBuildIdentifier := Option(System.getenv("BUILD_NUMBER")).getOrElse("DEV")
