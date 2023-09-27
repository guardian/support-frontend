// cdk/lib/starter-typescript-lambda.ts

import { GuScheduledLambda } from '@guardian/cdk';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { Duration } from 'aws-cdk-lib';
import type { App } from 'aws-cdk-lib';
import { Schedule } from 'aws-cdk-lib/aws-events';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

const APP_NAME = 'support-frontend-post-deployment-tests-lambda';

export enum LoggingLevel {
  SILLY,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

export class SupportFrontendPostDeploymentTestsLambda extends GuStack {
  constructor(
    scope: App,
    id: string,
    props: GuStackProps,
    loggingLevel: number = LoggingLevel.WARN,
  ) {
    super(scope, id, props);

    const otherConfig = {
      app: APP_NAME,
      runtime: Runtime.NODEJS_18_X,
      fileName: `${APP_NAME}.zip`,
      timeout: Duration.millis(45000),
    };

    new GuScheduledLambda(this, APP_NAME, {
      handler: "com.gu.supportFrontendPostDeploymentTests.Lambda::handler",
      rules: [
        {
          schedule: Schedule.cron({ hour: '10', minute: '00', weekDay: '2' }),
        },
      ],
      monitoringConfiguration: {
        noMonitoring: true,
      },
      ...otherConfig,
    });
  }
}
