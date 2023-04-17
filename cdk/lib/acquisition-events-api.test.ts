import { App } from "aws-cdk-lib";
import {Template} from "aws-cdk-lib/assertions";
import {AcquisitionEventsApi} from "./acquisition-events-api";


describe("The Acquisition Events API stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const codeStack = new AcquisitionEventsApi(app, "Acquisition-Events-API-CODE", {
      stack: "support",
      stage: "CODE",
      certificateId:"b384a6a0-2f54-4874-b99b-96eeff96c009",
      domainName: "acquisition-events-code.support.guardianapis.com",
      hostedZoneName: "support.guardianapis.com.",
      hostedZoneId: "Z3KO35ELNWZMSX",
    });
    const prodStack = new AcquisitionEventsApi(app, "Acquisition-Events-API-PROD", {
      stack: "support",
      stage: "PROD",
      certificateId:"b384a6a0-2f54-4874-b99b-96eeff96c009",
      domainName: "acquisition-events.support.guardianapis.com",
      hostedZoneName: "support.guardianapis.com.",
      hostedZoneId: "Z3KO35ELNWZMSX",
    });

    expect(Template.fromStack(codeStack).toJSON()).toMatchSnapshot();
    expect(Template.fromStack(prodStack).toJSON()).toMatchSnapshot();
  });
});
