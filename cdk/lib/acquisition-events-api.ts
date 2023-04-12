import { join } from "path";
import { GuApiLambda } from "@guardian/cdk";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { CfnBasePathMapping, CfnDomainName } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {CfnRecordSet} from "aws-cdk-lib/aws-route53";
import { CfnInclude } from "aws-cdk-lib/cloudformation-include";

export interface AcquisitionEventsApiProps extends GuStackProps {
  stack: string;
  stage: string;
  app: string;
  certificateId: string;
  domainName: string;
  hostedZoneName: string;
  hostedZoneId: string;
}


export class AcquisitionEventsApi extends GuStack {

  constructor(scope: App, id: string, props: AcquisitionEventsApiProps) {
    super(scope, id, props);


    const app = "acquisition-events-api";

     // ---- Existing CFN template ---- //
    const yamlTemplateFilePath = join(
      __dirname,
      "../..",
      "support-lambdas/acquisition-events-api/cfn.yaml"
    );
    const yamlDefinedResources = new CfnInclude(this, "YamlTemplate", {
      templateFile: yamlTemplateFilePath,
      parameters: {
        Stage: props.stage,
      },
    });

    const commonEnvironmentVariables = {
      App: app,
      Stack: this.stack,
      Stage: this.stage,
    };
// ---- API-triggered lambda functions ---- //
    const acquisitionEventsApiLambda= new GuApiLambda(this, "acquisition-events-api-lambda", {
      description: 'A lambda for acquisitions events api',
      functionName: `${app}-cdk-${this.stage}`,
      fileName: "acquisition-events-api.jar",
      handler: 'com.gu.acquisitionEventsApi.Lambda::handler',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 512,
      timeout:Duration.seconds(300),
      environment:commonEnvironmentVariables,
      // Create an alarm
      monitoringConfiguration: {
        http5xxAlarm: {tolerated5xxPercentage: 5},
        snsTopicName: "conversion-dev",
      },
      app: "acquisition-events-api",
      api: {
        id: `${app}-${this.stage}`,
        description: "API Gateway created by CDK",
      },
    });

    // ---- DNS ---- //
    const certificateArn = `arn:aws:acm:eu-west-1:${this.account}:certificate/${props.certificateId}`;
    const cfnDomainName = new CfnDomainName(this, "ApiDomainName", {
      domainName: props.domainName,
      regionalCertificateArn: certificateArn,
      endpointConfiguration: {
        types: ["REGIONAL"]
      }
    });

    new CfnBasePathMapping(this, "ApiMapping", {
      domainName: cfnDomainName.ref,
      // Uncomment the lines below to reroute traffic to the new API Gateway instance
      restApiId: acquisitionEventsApiLambda.api.restApiId,
      stage: acquisitionEventsApiLambda.api.deploymentStage.stageName,
      // restApiId: yamlDefinedResources.getResource("ServerlessRestApi").ref,
      // stage: props.stage,
    });

    new CfnRecordSet(this, "DNSRecord", {
      name: props.domainName,
      type: "CNAME",
      hostedZoneId: props.hostedZoneId,
      ttl: "60",
      resourceRecords: [
        cfnDomainName.attrRegionalDomainName
      ],
    });
  }
}
