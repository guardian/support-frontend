import { GuEc2App } from "@guardian/cdk";
import { AccessScope } from "@guardian/cdk/lib/constants";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import {
  GuDistributionBucketParameter,
  GuStack,
} from "@guardian/cdk/lib/constructs/core";
import { GuAllowPolicy } from "@guardian/cdk/lib/constructs/iam";
import type { GuAsgCapacity } from "@guardian/cdk/lib/types";
import type { App } from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  UserData,
} from "aws-cdk-lib/aws-ec2";
import { SslPolicy } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import type { CfnListener } from "aws-cdk-lib/aws-elasticloadbalancingv2";

interface BackendProps extends GuStackProps {
  domainName: string;
  scaling: GuAsgCapacity;
}

export class Backend extends GuStack {
  constructor(scope: App, id: string, props: BackendProps) {
    const { domainName, scaling } = props;

    super(scope, id, {
      ...props,
      // Required for ALB logging
      env: { region: "eu-west-1" },
    });

    const app = "support-backend";

    const userData = UserData.custom(`#!/bin/bash
groupadd support
useradd -r -m -s /usr/bin/nologin -g support ${app}
cd /home/${app}
mkdir ${app}
chown -R ${app}:support ${app}
cd ${app}

sleep 5
aws --region eu-west-1 s3 cp s3://${
      GuDistributionBucketParameter.getInstance(this).valueAsString
    }/support/${this.stage}/${app}/${app}.tar.gz ./
tar -xzf ${app}.tar.gz

export TERM=xterm-256color
export NODE_ENV=production
export stage=${this.stage}

mkdir /var/log/${app}
chown -R ${app}:support /var/log/${app}

/usr/local/node/pm2 start --uid ${app} --gid support server.js`);

    const policies = [
      new GuAllowPolicy(this, "SSMGet", {
        actions: ["ssm:GetParametersByPath"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/${this.stack}/${app}/${this.stage}`,
        ],
      }),
      new GuAllowPolicy(this, "CloudwatchMetrics", {
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "logs:DescribeLogStreams",
        ],
        resources: ["arn:aws:logs:*:*:*"],
      }),
    ];

    const ec2App = new GuEc2App(this, {
      applicationPort: 3000,
      app: "backend",
      access: { scope: AccessScope.PUBLIC },
      certificateProps: {
        domainName,
        hostedZoneId: "Z1E4V12LQGXFEC",
      },
      instanceMetricGranularity: "5Minute",
      monitoringConfiguration: { noMonitoring: true },
      userData,
      roleConfiguration: {
        additionalPolicies: policies,
      },
      scaling,
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
    });

    (ec2App.listener.node.defaultChild as CfnListener).sslPolicy =
      SslPolicy.TLS13_RES;
  }
}
