import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {StripeIntentLambda} from "./stripe-intent-lambda";

describe("The stripe-intent-lambda stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new StripeIntentLambda(app, "StripeIntentLambda-PROD", {
      stack: "support",
      stage: "PROD",
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
