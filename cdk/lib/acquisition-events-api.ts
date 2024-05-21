import { DomainName, HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import type { App } from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import { CfnIntegration, CfnRoute } from "aws-cdk-lib/aws-apigatewayv2";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { ComparisonOperator, Metric } from "aws-cdk-lib/aws-cloudwatch";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
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
      snsTopicName: 'alarms-handler-topic-PROD',
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

    const domainName = new DomainName(this, "DomainName", {
      domainName: props.domainName,
      certificate: Certificate.fromCertificateArn(this, "cert", certificateArn),
    });

    new CfnRecordSet(this, "DNSRecord", {
      name: props.domainName,
      type: "CNAME",
      hostedZoneId: props.hostedZoneId,
      ttl: "120",
      resourceRecords: [domainName.regionalDomainName],
    });

    // ---- Eventbridge stuff ---- //
    // There's no Eventbridge integration available as CDK L2 yet, so we have to use L1 and create Role, Integration and Route
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-apigatewayv2-alpha-readme.html#defining-http-apis

    const eventBusArn = `arn:aws:events:eu-west-1:865473395570:event-bus/acquisitions-bus-${props.stage}`;

    // Api
    const httpApi = new HttpApi(
      this,
      `acquisitions-eventbridge-api-${props.stage}`,
      {
        defaultDomainMapping: {
          domainName: domainName,
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

    // Routes
    new CfnRoute(this, "AcquisitionRoute", {
      apiId: httpApi.httpApiId,
      routeKey: "POST /acquisition",
      target: `integrations/${eventBridgeIntegration.ref}`,
    });

    new CfnRoute(this, "FallbackRoute", {
      apiId: httpApi.httpApiId,
      routeKey: "POST /",
      target: `integrations/${eventBridgeIntegration.ref}`,
    });
  }
}
