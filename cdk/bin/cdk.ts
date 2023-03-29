import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { Frontend } from "../lib/frontend";
import { PaymentApi } from "../lib/payment-api";
import { StripePatronsData } from "../lib/stripe-patrons-data";

const app = new App();
const cloudFormationStackName = process.env.GU_CFN_STACK_NAME;

new Frontend(app, "Frontend-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
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

new Frontend(app, "Frontend-CODE", {
  stack: "support",
  stage: "CODE",
  cloudFormationStackName,
  membershipSubPromotionsTable:
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-DEV",
  redemptionCodesTable: "arn:aws:dynamodb:*:*:table/redemption-codes-DEV",
  domainName: "support.code.theguardian.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 1,
    maximumInstances: 2,
  },
  shouldEnableAlarms: false,
});

new StripePatronsData(app, "StripePatronsData-CODE", {
  stack: "support",
  stage: "CODE",
  cloudFormationStackName,
  buildNumber: process.env.GITHUB_RUN_NUMBER ?? "DEV",
});

new StripePatronsData(app, "StripePatronsData-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
  buildNumber: process.env.GITHUB_RUN_NUMBER ?? "DEV",
});

new PaymentApi(app, "Payment-API-CODE", {
  stack: "support",
  stage: "CODE",
  domainName:
    "pay.code.dev-guardianapis.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 1,
    maximumInstances: 2,
  },
});

new PaymentApi(app, "Payment-API-PROD", {
  stack: "support",
  stage: "PROD",
  domainName: "payment.guardianapis.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 3,
    maximumInstances: 6,
  },
});
