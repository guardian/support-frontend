import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import {AcquisitionEventsApi} from "./acquisition-events-api";

describe("The Acquisition Events API stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new AcquisitionEventsApi(app, "Frontend-PROD", {
      stack: "support",
      stage: "PROD",
    });

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
