import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BigqueryAcquisitionsPublisher } from "./bigquery-acquisitions-publisher";

describe("The BigqueryAcquisitionsPublisher stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new BigqueryAcquisitionsPublisher(
      app,
      "BigqueryAcquisitionsPublisher-PROD",
      {
        stack: "support",
        stage: "PROD",
        softOptInConsentSetterQueueArn: "arn:aws:sqs:eu-west-1:865473395570:soft-opt-in-consent-setter-queue-PROD",
      }
    );

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
