import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { AcquisitionEventsApi } from "../lib/acquisition-events-api";
import type { AcquisitionEventsApiProps} from "../lib/acquisition-events-api";
import { Frontend } from "../lib/frontend";
import {PaymentApi} from "../lib/payment-api";
import { StripePatronsData } from "../lib/stripe-patrons-data";



const app = new App();
const cloudFormationStackName = process.env.GU_CFN_STACK_NAME;

new Frontend(app, "Frontend-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
  membershipSubPromotionsTables:
    [
      "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
      "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-DEV",
    ],
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
  membershipSubPromotionsTables: ["arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-DEV"],
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
});

new StripePatronsData(app, "StripePatronsData-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
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

export const codeProps: AcquisitionEventsApiProps = {
  stack: "support",
  stage: "CODE",
  app: "acquisition-events-api",
  certificateId:"b384a6a0-2f54-4874-b99b-96eeff96c009",
  domainName: "acquisition-events-code.support.guardianapis.com",
  hostedZoneName:"support.guardianapis.com.",
  hostedZoneId:"Z3KO35ELNWZMSX",
};

export const prodProps: AcquisitionEventsApiProps = {
  stack: "support",
  stage: "PROD",
  app: "acquisition-events-api",
  certificateId: "b384a6a0-2f54-4874-b99b-96eeff96c009",
  domainName: "acquisition-events.support.guardianapis.com",
  hostedZoneName: "support.guardianapis.com.",
  hostedZoneId: "Z3KO35ELNWZMSX",
};

new AcquisitionEventsApi(app, "Acquisition-Events-Api-CODE", codeProps);
new AcquisitionEventsApi(app, "Acquisition-Events-Api-PROD", prodProps);
