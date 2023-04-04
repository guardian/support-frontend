import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import type { App } from "aws-cdk-lib";


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
      "DatalakeBucket",
      {
        description:
          "Bucket to upload data for ingestion into BigQuery",
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

    // ---- DNS Records ---- //
    // new GuCname(this, id: string, props: GuCnameProps)

    // ---- Lambdas ---- //
    const lambda=new GuApiLambda(stack, "acquisition-events-api", {
      fileName: "${Stack}/${Stage}/${App}/${App}.jar",
      handler: 'com.gu.acquisitionEventsApi.Lambda.handler',
      runtime: Runtime.NODEJS_14_X,
      functionName: `${app}-${stage}`,
      code: lambda.Code.fromBucket(deployBucket, `${stackName || "support"}/${stage}/${app}/${fileName}`),
      memorySize: 512,
      role: lambdaRole,
      timeout: cdk.Duration.seconds(300),
      environment: {
        STAGE: stage,
      },
      tags: {
        "lambda:createdBy": "SAM",
      },
      // Create an alarm
      monitoringConfiguration: {
        http5xxAlarm: { tolerated5xxPercentage: 1 },
        snsTopicName: "conversion-dev",
      },
      app: "acquisition-events-api",
      api: {
        id: props.api?.id || "default-api-id",
        description: props.api?.description || "API Gateway created by CDK",
      },
    });
}
