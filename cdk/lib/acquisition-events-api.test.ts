import "@aws-cdk/assert/jest";
import { App } from "aws-cdk-lib";
import {AcquisitionEventsApi} from "./acquisition-events-api";
import {Template} from "aws-cdk-lib/assertions";

describe("The Acquisition Events API stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new AcquisitionEventsApi(app, "Acquisition-Events-API-PROD", {
      stack: "support",
      stage: "PROD",
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
