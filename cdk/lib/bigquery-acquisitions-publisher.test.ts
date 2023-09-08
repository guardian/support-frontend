import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import {BigqueryAcquisitionsPublisher} from "./bigquery-acquisitions-publisher";

describe("The BigqueryAcquisitionsPublisher stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new BigqueryAcquisitionsPublisher(app, "BigqueryAcquisitionsPublisher-PROD", {
      stack: "support",
      stage: "PROD",
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
