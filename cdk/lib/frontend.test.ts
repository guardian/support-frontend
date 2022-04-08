import "@aws-cdk/assert/jest";
import { SynthUtils } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { Frontend } from "./frontend";

describe("The Frontend stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new Frontend(app, "Frontend-PROD", {
      stack: "support",
      stage: "PROD",
      membershipSubPromotionsTable:
        "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
      redemptionCodesTable: "arn:aws:dynamodb:*:*:table/redemption-codes-PROD",
      domainName: "support.theguardian.com.origin.membership.guardianapis.com",
      scaling: {
        minimumInstances: 3,
        maximumInstances: 6,
      },
      shouldEnableAlarms: true,
    });

    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
