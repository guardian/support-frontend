import { join } from "path";
import {
  ComparisonOperator,
  Metric,
  TreatMissingData,
} from "@aws-cdk/aws-cloudwatch";
import { InstanceClass, InstanceSize, InstanceType } from "@aws-cdk/aws-ec2";
import { FilterPattern, LogGroup, MetricFilter } from "@aws-cdk/aws-logs";
import { CfnInclude } from "@aws-cdk/cloudformation-include";
import type { App } from "@aws-cdk/core";
import { Duration, Tags } from "@aws-cdk/core";
import { GuEc2App } from "@guardian/cdk";
import { AccessScope, Stage } from "@guardian/cdk/lib/constants";
import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack, GuStageParameter } from "@guardian/cdk/lib/constructs/core";
import {
  GuAllowPolicy,
  GuGetS3ObjectsPolicy,
  GuPutCloudwatchMetricsPolicy,
} from "@guardian/cdk/lib/constructs/iam";

export class Frontend extends GuStack {
  constructor(scope: App, id: string, props: GuStackProps) {
    super(scope, id, props);
    const yamlTemplateFilePath = join(
      __dirname,
      "../..",
      "support-frontend/cloud-formation/cfn.yaml"
    );
    new CfnInclude(this, "YamlTemplate", {
      templateFile: yamlTemplateFilePath,
      parameters: {
        Stage: GuStageParameter.getInstance(this),
      },
    });

    const app = "frontend";

    const userData = `#!/bin/bash -ev
    mkdir /etc/gu
    aws --region ${this.region} s3 cp s3://membership-dist/${this.stack}/${this.stage}/${app}/support-frontend_1.0-SNAPSHOT_all.deb /tmp
    dpkg -i /tmp/support-frontend_1.0-SNAPSHOT_all.deb
    /opt/cloudwatch-logs/configure-logs application ${this.stack} ${this.stage} ${app} /var/log/support-frontend/application.log '%Y-%m-%dT%H:%M:%S,%f%z'`;

    const membershipSubPromotionsTable = this.withStageDependentValue({
      app,
      variableName: "MembershipSubPromotions",
      stageValues: {
        // TODO: Should these dynamo tables be region specific?
        CODE: "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-DEV",
        PROD: "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-PROD",
      },
    });

    const redemptionCodesTable = this.withStageDependentValue({
      app,
      variableName: "RedemptionCodes",
      stageValues: {
        // TODO: Should these dynamo tables be region specific?
        CODE: "arn:aws:dynamodb:*:*:table/redemption-codes-DEV",
        PROD: "arn:aws:dynamodb:*:*:table/redemption-codes-PROD",
      },
    });

    const policies = [
      // TODO: can we 'standardise' the way we load config to use the default permissons from GuEc2App?
      new GuAllowPolicy(this, "SSMGet", {
        actions: ["ssm:GetParametersByPath"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/${this.stack}/${app}/${this.stage}`,
        ],
      }),
      new GuGetS3ObjectsPolicy(this, "PrivateBucket", {
        bucketName: "gu-zuora-catalog",
        paths: [
          "PROD/Zuora-PROD/catalog.json",
          "PROD/Zuora-UAT/catalog.json",
          "PROD/Zuora-DEV/catalog.json",
        ],
      }),
      new GuGetS3ObjectsPolicy(this, "SettingsBucket", {
        bucketName: "support-admin-console",
        paths: [`${this.stage}/*`],
      }),
      new GuPutCloudwatchMetricsPolicy(this),
      // TODO: should we move logs to kinesis?
      new GuAllowPolicy(this, "CloudwatchMetrics", {
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams",
        ],
        resources: ["arn:aws:logs:*:*:*"],
      }),
      new GuAllowPolicy(this, "StateMachines", {
        actions: [
          "states:ListStateMachines",
          "states:StartExecution",
          "states:GetExecutionHistory",
          "states:DescribeStateMachine",
        ],
        resources: ["arn:aws:states:*:*:*"],
      }),
      new GuAllowPolicy(this, "DynamoPromotions", {
        actions: [
          "dynamodb:GetItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:DescribeTable",
        ],
        resources: [
          membershipSubPromotionsTable,
          "arn:aws:dynamodb:*:*:table/MembershipSub-Promotions-UAT",
        ],
      }),
      new GuAllowPolicy(this, "DynamoRedemptions", {
        actions: ["dynamodb:GetItem"],
        resources: [
          redemptionCodesTable,
          "arn:aws:dynamodb:*:*:table/redemption-codes-UAT",
        ],
      }),
      new GuAllowPolicy(this, "StripeSetupIntentLambda", {
        actions: ["lambda:InvokeFunction"],
        resources: [
          `arn:aws:lambda:eu-west-1:${this.account}:function:stripe-intent-${this.stage}`,
        ],
      }),
    ];

    const minimumProdInstances = 3;

    const ec2App = new GuEc2App(this, {
      applicationPort: 9000,
      app: "frontend",
      access: { scope: AccessScope.PUBLIC },
      certificateProps: {
        [Stage.CODE]: {
          domainName:
            "support.code.theguardian.com.origin.membership.guardianapis.com",
          hostedZoneId: "Z1E4V12LQGXFEC",
        },
        [Stage.PROD]: {
          domainName:
            "support.theguardian.com.origin.membership.guardianapis.com",
          hostedZoneId: "Z1E4V12LQGXFEC",
        },
      },
      monitoringConfiguration: {
        noMonitoring: true,
      },
      userData,
      roleConfiguration: {
        additionalPolicies: policies,
      },
      scaling: {
        PROD: {
          minimumInstances: minimumProdInstances,
          maximumInstances: 6,
        },
        CODE: {
          minimumInstances: 1,
          maximumInstances: 2,
        },
      },
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
    });

    // TODO: remove this tag after the migration
    const ec2AppAsg = ec2App.autoScalingGroup;
    Tags.of(ec2AppAsg).add("gu:riffraff:new-asg", "true");

    // ---- Alarms ---- //

    // TODO: remove [CDK] prefix. This prefix is needed as the alarms need to have
    // a different name from the ones in the cloudformation template. We can remove
    // this after the migration
    const alarmName = (shortDescription: string) =>
      `[CDK] URGENT 9-5 - ${this.stage} ${shortDescription}`;

    const alarmDescription = (description: string) =>
      `Impact - ${description}. Follow the process in https://docs.google.com/document/d/1_3El3cly9d7u_jPgTcRjLxmdG2e919zCLvmcFCLOYAk/edit`;

    const alarmEnabledInProd = this.withStageDependentValue({
      app,
      variableName: "AlarmEnabledInProd",
      stageValues: {
        [Stage.CODE]: false,
        [Stage.PROD]: true,
      },
    });

    new GuAlarm(this, "NoHealthyInstancesAlarm", {
      app,
      alarmName: alarmName("no healthy instances for support-frontend"),
      alarmDescription: alarmDescription(
        "Cannot sell any subscriptions or contributions products"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: 0.5,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "HealthyHostCount",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: ec2App.loadBalancer.loadBalancerFullName,
          TargetGroup: ec2App.targetGroup.targetGroupFullName,
        },
        statistic: "Average",
        period: Duration.seconds(60),
      }),
      snsTopicName: "reader-revenue-dev",
    });

    new GuAlarm(this, "ReducedHealthyInstancesAlarm", {
      app,
      alarmName: alarmName(
        "reduced number healthy instances for support-frontend"
      ),
      alarmDescription: alarmDescription(
        "Imminent issue cannot sell any subscriptions or contributions products"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: minimumProdInstances - 1,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "HealthyHostCount",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: ec2App.loadBalancer.loadBalancerFullName,
          TargetGroup: ec2App.targetGroup.targetGroupFullName,
        },
        statistic: "Average",
        period: Duration.seconds(300),
      }),
      snsTopicName: "reader-revenue-dev",
    });

    new GuAlarm(this, "High5XXRateAlarm", {
      app,
      alarmName: alarmName(
        "support-frontend instances are returning 5XX errors"
      ),
      alarmDescription: alarmDescription(
        "Some or all actions on support website are failing"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: 3,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "HTTPCode_Target_5XX_Count",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: ec2App.loadBalancer.loadBalancerFullName,
          TargetGroup: ec2App.targetGroup.targetGroupFullName,
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      snsTopicName: "reader-revenue-dev",
    });

    new GuAlarm(this, "HighELB5XXRateAlarm", {
      app,
      alarmName: alarmName("support-frontend ELB is returning 5XX errors"),
      alarmDescription: alarmDescription(
        "Some or all actions on support website are failing"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: 3,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "HTTPCode_ELB_5XX_Count",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: ec2App.loadBalancer.loadBalancerFullName,
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      snsTopicName: "reader-revenue-dev",
    });

    new GuAlarm(this, "LatencyNotificationAlarm", {
      app,
      alarmName: alarmName("support-frontend has high latency"),
      alarmDescription: alarmDescription(
        "support-frontend users are seeing slow responses"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: 1,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "TargetResponseTime",
        namespace: "AWS/ApplicationELB",
        dimensionsMap: {
          LoadBalancer: ec2App.loadBalancer.loadBalancerFullName,
          TargetGroup: ec2App.targetGroup.targetGroupFullName,
        },
        statistic: "Average",
        period: Duration.seconds(60),
      }),
      snsTopicName: "reader-revenue-dev",
    });

    // TODO: Do we still need this?
    new GuAlarm(this, "CatalogLoadingFailureAlarm", {
      app,
      alarmName: alarmName(
        "support-frontend could not load the Zuora catalog from S3"
      ),
      alarmDescription:
        "Impact - Cannot sell any subscriptions products. Follow the process in https://docs.google.com/document/d/1_3El3cly9d7u_jPgTcRjLxmdG2e919zCLvmcFCLOYAk/edit",
      actionsEnabled: alarmEnabledInProd,
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "CatalogLoadingFailure",
        namespace: "support-frontend",
        dimensionsMap: {
          Environment: "PROD",
        },
        statistic: "Average",
        period: Duration.seconds(60),
      }),
      snsTopicName: "reader-revenue-dev",
    });

    const stateMachineUnavailableMetricFilter = new MetricFilter(
      this,
      "StateMachineUnavailableMetricFilter",
      {
        logGroup: LogGroup.fromLogGroupName(
          this,
          "SupportFrontendLogGroup",
          `support-frontend-${this.stage}`
        ),
        metricNamespace: `support-frontend-${this.stage}`,
        metricName: "state-machine-unavailable",
        filterPattern: FilterPattern.literal(
          '"regular-contributions-state-machine-unavailable"'
        ),
        metricValue: "1",
      }
    );

    new GuAlarm(this, "StateMachineUnavailableAlarm", {
      app,
      alarmName: alarmName("support-workers state machine unavailable"),
      alarmDescription: alarmDescription(
        "Cannot sell any subscriptions products"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: 1,
      evaluationPeriods: 2,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: stateMachineUnavailableMetricFilter.metric({
        period: Duration.seconds(60),
        statistic: "Sum",
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "reader-revenue-dev",
    });

    new GuAlarm(this, "ServerSideCreateFailureAlarm", {
      app,
      alarmName: alarmName(
        "support-frontend create recurring product call failed"
      ),
      alarmDescription: alarmDescription(
        "Someone pressed buy on a recurring product but received an error"
      ),
      actionsEnabled: alarmEnabledInProd,
      threshold: 1,
      evaluationPeriods: 1,
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      metric: new Metric({
        metricName: "ServerSideCreateFailure",
        namespace: "support-frontend",
        dimensionsMap: {
          Stage: "PROD",
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      treatMissingData: TreatMissingData.NOT_BREACHING,
      snsTopicName: "reader-revenue-dev",
    });
  }
}
