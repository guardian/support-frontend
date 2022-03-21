import "source-map-support/register";
import { App } from "@aws-cdk/core";
import { Frontend } from "../lib/frontend";

const app = new App();
const cloudFormationStackName = process.env.GU_CFN_STACK_NAME;
new Frontend(app, "Frontend", { stack: "support", cloudFormationStackName });
