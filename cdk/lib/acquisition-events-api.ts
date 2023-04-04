import { GuApiLambda } from "@guardian/cdk";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack, GuStringParameter } from "@guardian/cdk/lib/constructs/core";
import type { App } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class AcquisitionEventsApi extends GuStack {

  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);

    // ---- String Parameters ---- //
    new GuStringParameter(
      this,
      "CertificateArn",
      {
        description:
          "ARN of the certificate",
      }
    );

    new GuStringParameter(
      this,
      "DeployBucket",
      {
        description:
          "Bucket to copy files to",
      }
    );

    new GuStringParameter(
      this,
      "App",
      {
        description:
          "Acquisition Events Api",
      }
    );

    new GuStringParameter(
      this,
      "Stage",
      {
        description:
          "Set by RiffRaff on each deploy",
      }
    );

    new GuStringParameter(
      this,
      "Stack",
      {
        description:
          "Stack name",
      }
    );

// ---- API-triggered lambda functions ---- //
    const acquisitionEventsApiLambda= new GuApiLambda(this, "acquisition-events-api", {
      fileName: "${Stack}/${Stage}/${App}/${App}.jar",
      handler: 'com.gu.acquisitionEventsApi.Lambda.handler',
      runtime: Runtime.NODEJS_14_X,
      // Create an alarm
      monitoringConfiguration: {
        http5xxAlarm: {tolerated5xxPercentage: 5},
        snsTopicName: "conversion-dev",
      },
      app: "acquisition-events-api",
      api: {
        id: "acquisition-events-api",
        description: "API Gateway created by CDK",
      },
    });

  }
}
