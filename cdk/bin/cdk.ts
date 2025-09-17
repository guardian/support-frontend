import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { AcquisitionEventsApi } from "../lib/acquisition-events-api";
import { BigqueryAcquisitionsPublisher } from "../lib/bigquery-acquisitions-publisher";
import { Frontend } from "../lib/frontend";
import { PaymentApi } from "../lib/payment-api";
import { StripePatronsData } from "../lib/stripe-patrons-data";
import { SupportWorkers } from "../lib/support-workers";

const app = new App();
const cloudFormationStackName = process.env.GU_CFN_STACK_NAME;

new Frontend(app, "Frontend-PROD", {
  stack: "support",
  stage: "PROD",
  cloudFormationStackName,
  membershipSubPromotionsTables: [
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-CODE",
  ],
  domainName: "support.theguardian.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 3,
    maximumInstances: 6,
  },
  shouldCreateAlarms: true,
  shouldEnableAlbAccessLogs: false,
});

new Frontend(app, "Frontend-CODE", {
  stack: "support",
  stage: "CODE",
  cloudFormationStackName,
  membershipSubPromotionsTables: [
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-CODE",
  ],
  domainName: "support.code.theguardian.com.origin.membership.guardianapis.com",
  scaling: {
    minimumInstances: 1,
    maximumInstances: 2,
  },
  shouldCreateAlarms: false,
  shouldEnableAlbAccessLogs: true,
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

new AcquisitionEventsApi(app, "Acquisition-Events-API-CODE", {
  stack: "support",
  stage: "CODE",
  certificateId: "b384a6a0-2f54-4874-b99b-96eeff96c009",
  domainName: "acquisition-events-code.support.guardianapis.com",
  hostedZoneName: "support.guardianapis.com.",
  hostedZoneId: "Z3KO35ELNWZMSX",
});

new AcquisitionEventsApi(app, "Acquisition-Events-API-PROD", {
  stack: "support",
  stage: "PROD",
  certificateId: "b384a6a0-2f54-4874-b99b-96eeff96c009",
  domainName: "acquisition-events.support.guardianapis.com",
  hostedZoneName: "support.guardianapis.com.",
  hostedZoneId: "Z3KO35ELNWZMSX",
});

new BigqueryAcquisitionsPublisher(app, "BigqueryAcquisitionsPublisher-CODE", {
  stack: "support",
  stage: "CODE",
});

new BigqueryAcquisitionsPublisher(app, "BigqueryAcquisitionsPublisher-PROD", {
  stack: "support",
  stage: "PROD",
});

new SupportWorkers(app, "SupportWorkers-CODE", {
  stack: "support",
  stage: "CODE",
  promotionsDynamoTables: [
    "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-CODE",
  ],
  s3Files: [
    "arn:aws:s3:::gu-zuora-catalog/PROD/Zuora-CODE/catalog.json",
    "arn:aws:s3:::support-workers-private/*",
  ],
  supporterProductDataTables: [
    "supporter-product-data-tables-CODE-SupporterProductDataTable",
  ],
  eventBusArns: [
    "arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-CODE",
  ],
  parameterStorePaths: [
    `arn:aws:ssm:eu-west-1:865473395570:parameter/CODE/support/support-workers/*`,
  ],
  secretsManagerPaths: [
    "arn:aws:secretsmanager:eu-west-1:865473395570:secret:CODE/Zuora-OAuth/SupportServiceLambdas-*",
  ],
});

new SupportWorkers(app, "SupportWorkers-PROD", {
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
  secretsManagerPaths: [
    "arn:aws:secretsmanager:eu-west-1:865473395570:secret:CODE/Zuora-OAuth/SupportServiceLambdas-*",
    "arn:aws:secretsmanager:eu-west-1:865473395570:secret:PROD/Zuora-OAuth/SupportServiceLambdas-*",
  ],
});
