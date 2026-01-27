import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ItTestRunnerDocker } from "./it-test-runner-docker";

describe("IT Test Runner Docker stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new ItTestRunnerDocker(app, "ItTestRunnerDocker-PROD", {
      stack: "support",
      stage: "PROD",
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
