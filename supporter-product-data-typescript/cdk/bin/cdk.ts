import { App } from "aws-cdk-lib";
import { SupporterProductDataStack } from "../lib/supporterProductDataStack";

const app = new App();

(["CODE", "PROD"] as const).forEach((stage) => {
  new SupporterProductDataStack(
    app,
    `SupporterProductDataTypescript-${stage}`,
    {
      stage,
      env: { region: "eu-west-1" },
    }
  );
});
