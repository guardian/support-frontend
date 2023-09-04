import { DomainName, HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { GuApiLambda } from "@guardian/cdk";
import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { CfnBasePathMapping, CfnDomainName } from "aws-cdk-lib/aws-apigateway";
import { CfnIntegration, CfnRoute } from "aws-cdk-lib/aws-apigatewayv2";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ComparisonOperator, Metric } from "aws-cdk-lib/aws-cloudwatch";
import {
  Effect,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { CfnRecordSet } from "aws-cdk-lib/aws-route53";

export interface AcquisitionEventsApiProps extends GuStackProps {
  stack: string;
  stage: string;
  certificateId: string;
  domainName: string;
  hostedZoneName: string;
  hostedZoneId: string;
}

export class AcquisitionEventsApi extends GuStack {
  constructor(scope: App, id: string, props: AcquisitionEventsApiProps) {
    super(scope, id, props);

    const app = "acquisition-events-api";

    const commonEnvironmentVariables = {
      App: app,
      Stack: this.stack,
      Stage: this.stage,
    };

    // ---- API-triggered lambda functions ---- //
    // const acquisitionEventsApiLambda = new GuApiLambda(
    //   this,
    //   "acquisition-events-api-cdk-lambda",
    //   {
    //     description:
    //       "A lambda that Sends in-app acquisitions (subscriptions) to BigQuery",
    //     functionName: `${app}-cdk-${this.stage}`,
    //     fileName: `${app}.jar`,
    //     handler: "com.gu.acquisitionEventsApi.Lambda::handler",
    //     runtime: Runtime.JAVA_8,
    //     memorySize: 1024,
    //     timeout: Duration.seconds(300),
    //     environment: commonEnvironmentVariables,
    //     // Create an alarm
    //     monitoringConfiguration: {
    //       http5xxAlarm: { tolerated5xxPercentage: 5 },
    //       snsTopicName: "conversion-dev",
    //     },
    //     app: "acquisition-events-api",
    //     api: {
    //       id: `${app}-${this.stage}`,
    //       description: "API Gateway created by CDK",
    //     },
    //   }
    // );

    // ---- Alarms ---- //
    const alarmName = (shortDescription: string) =>
      `ACQUISITION-EVENTS-API-CDK- ${this.stage} ${shortDescription}`;

    const alarmDescription = (description: string) =>
      `Impact - ${description}. Follow the process in https://docs.google.com/document/d/1_3El3cly9d7u_jPgTcRjLxmdG2e919zCLvmcFCLOYAk/edit`;

    new GuAlarm(this, "ApiGateway4XXAlarmCDK", {
      app,
      alarmName: alarmName("API gateway 4XX response"),
      alarmDescription: alarmDescription(
        "Acquisition Events API received an invalid request"
      ),
      evaluationPeriods: 1,
      threshold: 1,
      snsTopicName: "contributions-dev",
      actionsEnabled: this.stage === "PROD",
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        statistic: "Sum",
        period: Duration.seconds(300),
        dimensionsMap: {
          ApiName: `${app}-${this.stage}`,
        },
      }),
    });

    // ---- DNS ---- //
    const certificateArn = `arn:aws:acm:eu-west-1:${this.account}:certificate/${props.certificateId}`;
    // const cfnDomainName = new CfnDomainName(this, "DomainName", {
    //   domainName: props.domainName,
    //   regionalCertificateArn: certificateArn,
    //   endpointConfiguration: {
    //     types: ["REGIONAL"],
    //   },
    // });
    //
    // new CfnBasePathMapping(this, "BasePathMapping", {
    //   domainName: cfnDomainName.ref,
    //   // Uncomment the lines below to reroute traffic to the new API Gateway instance
    //   restApiId: acquisitionEventsApiLambda.api.restApiId,
    //   stage: acquisitionEventsApiLambda.api.deploymentStage.stageName,
    //   // Uncomment the lines below to reroute traffic to the old (existing) API Gateway instance
    //   // restApiId: yamlDefinedResources.getResource("ServerlessRestApi").ref,
    //   // stage: props.stage,
    // });
    //
    // new CfnRecordSet(this, "DNSRecord", {
    //   name: props.domainName,
    //   type: "CNAME",
    //   hostedZoneId: props.hostedZoneId,
    //   ttl: "120",
    //   resourceRecords: [cfnDomainName.attrRegionalDomainName],
    // });

    // ---- Eventbridge stuff ---- //
    const eventBusArn = `arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-${props.stage}`;
    // There's no Eventbridge integration available as CDK L2 yet, so we have to use L1 and create Role, Integration and Route
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-apigatewayv2-alpha-readme.html#defining-http-apis
    const dn = new DomainName(this, "DomainName", {
      domainName: props.domainName,
      certificate: Certificate.fromCertificateArn(this, "cert", certificateArn),
    });

    const httpApi = new HttpApi(
      this,
      `acquisitions-eventbridge-api-${props.stage}`,
      {
        defaultDomainMapping: {
          domainName: dn,
          mappingKey: "foo",
        },
      }
    );

    // Role
    const apiRole = new Role(this, "EventBridgeIntegrationRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    apiRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [eventBusArn],
        actions: ["events:PutEvents"],
      })
    );

    // Integration
    const eventBridgeIntegration = new CfnIntegration(
      this,
      "EventBridgeIntegration",
      {
        apiId: httpApi.httpApiId,
        integrationType: "AWS_PROXY",
        integrationSubtype: "EventBridge-PutEvents",
        credentialsArn: apiRole.roleArn,
        requestParameters: {
          Source: "ApiGateway",
          DetailType: "AcquisitionsEvent",
          Detail: "$request.body",
          EventBusName: eventBusArn,
        },
        payloadFormatVersion: "1.0",
        timeoutInMillis: 10000,
      }
    );

    // Route
    new CfnRoute(this, "EventRoute", {
      apiId: httpApi.httpApiId,
      routeKey: "POST /",
      target: `integrations/${eventBridgeIntegration.ref}`,
    });

    // ---- Apply policies ---- //
    const ssmInlinePolicy: Policy = new Policy(this, "SSM inline policy", {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["ssm:GetParametersByPath"],
          resources: [
            `arn:aws:ssm:${this.region}:${this.account}:parameter/acquisition-events-api/bigquery-config/${props.stage}/*`,
          ],
        }),
      ],
    });

    const s3InlinePolicy: Policy = new Policy(this, "S3 inline policy", {
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ["s3:GetObject"],
          resources: ["arn:aws:s3::*:membership-dist/*"],
        }),
      ],
    });

    // acquisitionEventsApiLambda.role?.attachInlinePolicy(ssmInlinePolicy);
    // acquisitionEventsApiLambda.role?.attachInlinePolicy(s3InlinePolicy);
  }
}
