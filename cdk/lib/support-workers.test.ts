import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { SupportWorkers } from "./support-workers";

describe("The support-workers stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new SupportWorkers(app, "SupportWorkers-PROD", {
      stack: "support",
      stage: "PROD",
      promotionsDynamoTables: [
        "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-CODE",
        "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
      ],
      s3Files: [
        "arn:aws:s3:::gu-zuora-catalog/PROD/Zuora-CODE/catalog.json",
        "arn:aws:s3:::gu-zuora-catalog/PROD/Zuora-PROD/catalog.json",
        "arn:aws:s3:::support-workers-private/*",
      ],
      supporterProductDataTables: [
        "supporter-product-data-tables-CODE-SupporterProductDataTable",
        "supporter-product-data-tables-PROD-SupporterProductDataTable",
      ],
      eventBusArns: [
        "arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-CODE",
        "arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-PROD",
      ],
      parameterStorePaths: [
        `arn:aws:ssm:eu-west-1:865473395570:parameter/CODE/support/support-workers/*`,
        `arn:aws:ssm:eu-west-1:865473395570:parameter/PROD/support/support-workers/*`,
      ],
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
