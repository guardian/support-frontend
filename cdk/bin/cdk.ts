import "source-map-support/register";
import { App } from "aws-cdk-lib";
import {AcquisitionEventsApi} from "../lib/acquisition-events-api";
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

new AcquisitionEventsApi(app, "AcquisitionEventsAPI-CODE", {
  stack: "support",
  stage: "CODE",
});

new AcquisitionEventsApi(app, "AcquisitionEventsAPI-PROD", {
  stack: "support",
  stage: "PROD",
});
