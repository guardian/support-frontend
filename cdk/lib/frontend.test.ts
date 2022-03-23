import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { Frontend } from "./frontend";

describe("The Frontend stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new Frontend(app, "Frontend", { stack: "support" });
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
