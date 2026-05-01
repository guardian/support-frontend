import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Backend } from "./backend";

describe("The Backend stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new Backend(app, "Backend-PROD", {
      stack: "support",
      stage: "PROD",
      domainName: "backend.theguardian.com.origin.membership.guardianapis.com",
      scaling: {
        minimumInstances: 1,
        maximumInstances: 2,
      },
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
