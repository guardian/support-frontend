import { App } from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {AcquisitionEventsApi} from "./acquisition-events-api";


describe("The Acquisition Events API stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const codeStack = new AcquisitionEventsApi(
      app,
      "Acquisition-Events-API-CODE",
      codeProps
    );
    const prodStack = new AcquisitionEventsApi(
      app,
      "Acquisition-Events-API-PROD",
      prodProps
    );
    expect(Template.fromStack(codeStack).toJSON()).toMatchSnapshot();
    expect(Template.fromStack(prodStack).toJSON()).toMatchSnapshot();
  });
});
