import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Frontend } from "./frontend";

describe("The Frontend stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new Frontend(app, "Frontend-PROD", {
      stack: "support",
      stage: "PROD",
      membershipSubPromotionsTables: [
        "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
      ],
      domainName: "support.theguardian.com.origin.membership.guardianapis.com",
      scaling: {
        minimumInstances: 3,
        maximumInstances: 6,
      },
      shouldCreateAlarms: true,
      shouldEnableAlbAccessLogs: false,
    });

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
