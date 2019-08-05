version := "1.0-SNAPSHOT"

packageSummary := "Support frontend static files"

riffRaffPackageType := baseDirectory.value / "cfn"
riffRaffManifestProjectName := "support:frontend-static"
riffRaffPackageName := "cfn"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
