import { join } from "path";
import { GuApiLambda } from "@guardian/cdk";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack, GuStringParameter } from "@guardian/cdk/lib/constructs/core";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { CfnRecordSetGroup } from "aws-cdk-lib/aws-route53";
import { CfnInclude } from "aws-cdk-lib/cloudformation-include";

export interface AcquisitionEventsApiProps extends GuStackProps {
  stack: string;
  stage: string;
  app: string;
  certificateId: string;
  domainName: string;
  hostedZoneName: string;
}


export class AcquisitionEventsApi extends GuStack {

  constructor(scope: App, id: string, props: AcquisitionEventsApiProps) {
    super(scope, id, props);


    const app = "acquisition-events-api";

    const parameters = {
      CertificateArn: new GuStringParameter(this, "CertificateArn", {
        description: "ARN of the certificate",
      }),
      App: new GuStringParameter(this, "App", {
        description: "Acquisition Events Api",
      }),
      DeployBucket: new GuStringParameter(this, "DeployBucket", {
        description: "Bucket to copy files to",
      }),
      Stack: new GuStringParameter(this, "Stack", {
        description: "Stack name",
      }),
      Stage: new GuStringParameter(this, "Stage", {
        description: "Set by RiffRaff on each deploy",
      }),
    };


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
      functionName: {
        "Fn::Sub": [`${app}-${this.stage}`]
      },
      fileName: "${stack}/${this.stage}/${app}/${app}.jar",
      handler: 'com.gu.acquisitionEventsApi.Lambda::handler',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 512,
      timeout:Duration.seconds(300),
      Role: {
        "Fn::GetAtt": ["LambdaRole", "Arn"]
      },
      environment: {
        variables: {
          STAGE: { 'Fn::ImportValue': 'Stage' },
        },
      },
      // Create an alarm
      monitoringConfiguration: {
        http5xxAlarm: {tolerated5xxPercentage: 5},
        snsTopicName: "conversion-dev",
      },
      app: "acquisition-events-api",
      api: {
        id: "acquisition-events-api",
        description: "API Gateway created by CDK",

      Tag.add(this, 'lambda:createdBy', 'SAM');
      },
    });

    // ---- DNS ---- //
    const certificateArn = `arn:aws:acm:eu-west-1:${this.account}:certificate/${props.certificateId}`;
    const cfnDomainName = new CfnDomainName(this, "ApiDomainName", {
      domainName: props.domainName,
      certificateArn,
    });

    new CfnBasePathMapping(this, "ApiMapping", {
      domainName: cfnDomainName.ref,
      // Uncomment the lines below to reroute traffic to the new API Gateway instance
      // restApiId: acquisitionEventsApi.api.restApiId,
      // stage: acquisitionEventsApi.api.deploymentStage.stageName,
      restApiId: yamlDefinedResources.getResource("acquisitionEventsApi").ref,
      stage: props.stage,
    });

    new CfnRecordSetGroup(this, "ApiRoute53", {
      hostedZoneId: props.hostedZoneId,
      recordSets: [
        {
          name: props.domainName,
          type: "CNAME",
        },
      ],
  });
  }
}
