import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { StripePatronsData } from "./stripe-patrons-data";

describe("The Stripe patrons data stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new StripePatronsData(app, "StripePatronsData-PROD", {
      stack: "support",
      stage: "PROD",
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();

    //expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
