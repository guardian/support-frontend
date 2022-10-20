import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { PaymentApi } from "./payment-api";

describe("The Payment API stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new PaymentApi(app, "Frontend-PROD", {
      stack: "support",
      stage: "PROD",
      scaling: {
        minimumInstances: 3,
        maximumInstances: 6,
      },
      domainName: "payment.guardianapis.com.origin.membership.guardianapis.com",
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
