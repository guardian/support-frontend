import { GuAlarm } from "@guardian/cdk/lib/constructs/cloudwatch";
import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import { GuLambdaFunction } from "@guardian/cdk/lib/constructs/lambda";
import { type App, Duration, Fn } from "aws-cdk-lib";
import {
  ComparisonOperator,
  MathExpression,
  Metric,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Choice,
  Condition,
  DefinitionBody,
  Errors,
  Fail,
  Parallel,
  Pass,
  StateMachine,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";

const ProductTypes = {
  Contribution: "Contribution",
  Paper: "Paper",
  GuardianWeekly: "GuardianWeekly",
  SupporterPlus: "SupporterPlus",
  TierThree: "TierThree",
  GuardianAdLite: "GuardianAdLite",
} as const;

type ProductType = keyof typeof ProductTypes;

const PaymentProviders = {
  Stripe: "Stripe",
  DirectDebit: "DirectDebit",
  PayPal: "PayPal",
  StripeApplePay: "StripeApplePay",
  StripePaymentRequestButton: "StripePaymentRequestButton",
} as const;

type PaymentProvider = keyof typeof PaymentProviders;

interface SupportWorkersProps extends GuStackProps {
  promotionsDynamoTables: string[];
  s3Files: string[];
  supporterProductDataTables: string[];
  eventBusArns: string[];
  parameterStorePaths: string[];
}

export class SupportWorkers extends GuStack {
  constructor(scope: App, id: string, props: SupportWorkersProps) {
    super(scope, id, props);

    const app = "support-workers";

    // Define the policies
    const s3Policy = new PolicyStatement({
      actions: ["s3:GetObject"],
      resources: props.s3Files,
    });
    const emailSqsPolicy = new PolicyStatement({
      actions: ["sqs:GetQueueUrl", "sqs:SendMessage"],
      resources: [Fn.importValue(`comms-${this.stage}-EmailQueueArn`)],
    });
    const eventBusPolicy = new PolicyStatement({
      actions: ["events:PutEvents"],
      resources: props.eventBusArns,
    });
    const cloudWatchLoggingPolicy = new PolicyStatement({
      actions: [
        "logs:Create*",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams",
        "cloudwatch:putMetricData",
      ],
      resources: ["*"],
    });
    const promotionsDynamoTablePolicy = new PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:Scan",
        "dynamodb:Query",
        "dynamodb:DescribeTable",
      ],
      resources: props.promotionsDynamoTables,
    });
    const supporterProductDataTablePolicy = new PolicyStatement({
      actions: ["dynamodb:PutItem", "dynamodb:UpdateItem"],
      resources: props.supporterProductDataTables.map((table) =>
        Fn.importValue(table)
      ),
    });
    const parameterStorePolicy = new PolicyStatement({
      actions: ["ssm:GetParameter"],
      resources: props.parameterStorePaths,
    });
    const secretsManagerPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["secretsmanager:GetSecretValue"],
      resources: [
        `arn:aws:secretsmanager:${this.region}:${this.account}:secret:${this.stage}/Zuora-OAuth/SupportServiceLambdas-*`,
      ],
    });

    // Lambdas
    const lambdaDefaultConfig = {
      memorySize: 1536,
      timeout: Duration.seconds(300),
      architecture: Architecture.ARM_64,
      environment: {
        APP: app,
        STACK: this.stack,
        STAGE: this.stage,
        SENTRY_DSN:
          "https://55945d73ad654abd856d1523de4f9d56:cf9b33aaff3c483899dfa986abce55df@sentry.io/1212214",
        SENTRY_ENVIRONMENT: this.stage,
        GU_SUPPORT_WORKERS_STAGE: this.stage,
        EMAIL_QUEUE_NAME: Fn.importValue(`comms-${this.stage}-EmailQueueName`),
      },
    };

    const createScalaLambda = (
      lambdaName: string,
      additionalPolicies: PolicyStatement[] = []
    ) => {
      const lambdaId = `${lambdaName}Lambda`;
      const lambda = new GuLambdaFunction(this, lambdaId, {
        ...lambdaDefaultConfig,
        app: "support-workers-scala",
        fileName: `support-workers.jar`,
        runtime: Runtime.JAVA_21,
        handler: `com.gu.support.workers.lambdas.${lambdaName}::handleRequest`,
        functionName: `${this.stack}-${lambdaName}Lambda-${this.stage}`,
        initialPolicy: [
          s3Policy,
          cloudWatchLoggingPolicy,
          ...additionalPolicies,
        ],
      });
      this.overrideLogicalId(lambda, {
        logicalId: lambdaId,
        reason: "Moving existing lambda to CDK",
      });
      return new LambdaInvoke(this, lambdaName, {
        lambdaFunction: lambda,
        outputPath: "$.Payload", // Without this, LambdaInvoke wraps the output state as described here: https://github.com/aws/aws-cdk/issues/29473
      })
        .addRetry({
          errors: ["com.gu.support.workers.exceptions.RetryNone"],
          maxAttempts: 0,
        })
        .addRetry({
          errors: ["com.gu.support.workers.exceptions.RetryLimited"],
          maxAttempts: 5,
          interval: Duration.seconds(1),
          backoffRate: 10, // Retry after 1 sec, 10 sec, 100 sec, 16 mins and 2 hours 46 mins
        })
        .addRetry({
          errors: ["com.gu.support.workers.exceptions.RetryUnlimited"],
          maxAttempts: 999999, //If we don't provide a value here it defaults to 3
          interval: Duration.seconds(1),
          backoffRate: 2,
        })
        .addRetry({
          errors: [Errors.ALL], // Wildcard to capture any error which originates from outside of our code (e.g. an exception from AWS)
          maxAttempts: 999999,
          interval: Duration.seconds(3),
          backoffRate: 2,
        });
    };

    const createTypescriptLambda = (
      lambdaName: string,
      additionalPolicies: PolicyStatement[] = []
    ) => {
      const lambdaId = `${lambdaName}Lambda`;
      const lambdaTSFile = lambdaId.charAt(0).toLowerCase() + lambdaId.slice(1);
      const lambda = new GuLambdaFunction(this, lambdaId, {
        ...lambdaDefaultConfig,
        app: "support-workers-typescript",
        fileName: `support-workers.zip`,
        runtime: Runtime.NODEJS_22_X,
        handler: `${lambdaTSFile}.handler`,
        functionName: `${this.stack}-${lambdaName}Lambda-${this.stage}`,
        initialPolicy: [
          s3Policy,
          cloudWatchLoggingPolicy,
          parameterStorePolicy,
          ...additionalPolicies,
        ],
      });
      this.overrideLogicalId(lambda, {
        logicalId: lambdaId,
        reason: "Moving existing lambda to CDK",
      });
      return new LambdaInvoke(this, lambdaName, {
        lambdaFunction: lambda,
        outputPath: "$.Payload", // Without this, LambdaInvoke wraps the output state as described here: https://github.com/aws/aws-cdk/issues/29473
      })
        .addRetry({
          errors: ["RetryNone"],
          maxAttempts: 0,
        })
        .addRetry({
          errors: ["RetryLimited"],
          maxAttempts: 5,
          interval: Duration.seconds(1),
          backoffRate: 10, // Retry after 1 sec, 10 sec, 100 sec, 16 mins and 2 hours 46 mins
        })
        .addRetry({
          errors: ["RetryUnlimited"],
          maxAttempts: 999999, //If we don't provide a value here it defaults to 3
          interval: Duration.seconds(1),
          backoffRate: 2,
        })
        .addRetry({
          errors: [Errors.ALL], // Wildcard to capture any error which originates from outside of our code (e.g. an exception from AWS)
          maxAttempts: 999999,
          interval: Duration.seconds(3),
          backoffRate: 2,
        });
    };

    // State Machine
    const checkoutFailure = new Pass(this, "CheckoutFailure"); // This is a failed execution we don't want to alert on
    const failState = new Fail(this, "FailState"); // This is a failed execution we do want to alert on

    const succeedOrFailChoice = new Choice(this, "SucceedOrFailChoice")
      .when(
        Condition.booleanEquals("$.requestInfo.testUser", true),
        checkoutFailure
      )
      .when(Condition.booleanEquals("$.requestInfo.failed", true), failState)
      .otherwise(checkoutFailure);

    const failureHandler = createScalaLambda("FailureHandler", [
      emailSqsPolicy,
    ]).next(succeedOrFailChoice);

    const catchProps = {
      resultPath: "$.error",
      errors: ["States.TaskFailed"],
    };

    const createPaymentMethodLambda = createTypescriptLambda(
      "CreatePaymentMethod"
    ).addCatch(failureHandler, catchProps);

    const createSalesforceContactLambda = createTypescriptLambda(
      "CreateSalesforceContact"
    ).addCatch(failureHandler, catchProps);

    const createZuoraSubscriptionScala = createScalaLambda(
      "CreateZuoraSubscription",
      [promotionsDynamoTablePolicy]
    ).addCatch(failureHandler, catchProps);

    const createZuoraSubscriptionTS = createTypescriptLambda(
      "CreateZuoraSubscriptionTS",
      [promotionsDynamoTablePolicy, secretsManagerPolicy]
    ).addCatch(failureHandler, catchProps);

    const sendThankYouEmail = createScalaLambda("SendThankYouEmail", [
      emailSqsPolicy,
    ]);
    const updateSupporterProductData = createScalaLambda(
      "UpdateSupporterProductData",
      [supporterProductDataTablePolicy]
    );
    const sendAcquisitionEvent = createScalaLambda("SendAcquisitionEvent", [
      eventBusPolicy,
    ]);

    const checkoutSuccess = new Succeed(this, "CheckoutSuccess");

    const parallelSteps = new Parallel(this, "Parallel")
      .branch(sendThankYouEmail)
      .branch(updateSupporterProductData)
      .branch(sendAcquisitionEvent)
      .branch(checkoutSuccess);

    const createZuoraSubscriptionChoice = new Choice(
      this,
      "CreateZuoraSubscriptionChoice"
    )
      .when(
        Condition.and(
          Condition.isNotNull("$.state.productInformation"),
          Condition.stringEquals(
            "$.state.productInformation.product",
            "SupporterPlus"
          ),
          Condition.stringEquals(
            "$.state.productInformation.ratePlan",
            "OneYearStudent"
          )
        ),
        createZuoraSubscriptionTS.next(parallelSteps)
      )
      .otherwise(createZuoraSubscriptionScala.next(parallelSteps));

    const allSteps = createPaymentMethodLambda
      .next(createSalesforceContactLambda)
      .next(createZuoraSubscriptionChoice);

    const stateMachine = new StateMachine(this, "SupportWorkers", {
      stateMachineName: `${app}-${this.stage}`, // Used by support-frontend to find the state machine
      timeout: Duration.hours(24),
      definitionBody: DefinitionBody.fromChainable(allSteps),
    });

    this.overrideLogicalId(stateMachine, {
      logicalId: `SupportWorkers${this.stage}`,
      reason: "Moving existing step function to CDK",
    });

    // Alarms
    const isProd = this.stage === "PROD";

    new GuAlarm(this, "ExecutionFailureAlarm", {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `Support Workers Execution Failure in ${this.stage} (Recurring Contributions or Subscriptions Checkout).`,
      alarmDescription: `There was a failure whilst setting up recurring payments after the user attempted to complete a checkout process. Check https://eu-west-1.console.aws.amazon.com/states/home?region=eu-west-1#/statemachines/view/arn:aws:states:eu-west-1:865473395570:stateMachine:support-workers-${this.stage}?statusFilter=FAILED`,
      metric: new Metric({
        metricName: "ExecutionsFailed",
        namespace: "AWS/States",
        dimensionsMap: {
          StateMachineArn: stateMachine.stateMachineArn,
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      threshold: 1,
    }).node.addDependency(stateMachine);

    new GuAlarm(this, "TimeoutAlarm", {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `Support Workers Timeout in ${this.stage} (Recurring Contributions or Subscriptions Checkout).`,
      alarmDescription: `There was a timeout whilst setting up recurring payments after the user attempted to complete a checkout process. Check https://eu-west-1.console.aws.amazon.com/states/home?region=eu-west-1#/statemachines/view/arn:aws:states:eu-west-1:865473395570:stateMachine:support-workers-${this.stage}?statusFilter=TIMED_OUT`,
      metric: new Metric({
        metricName: "ExecutionsTimedOut",
        namespace: "AWS/States",
        dimensionsMap: {
          StateMachineArn: stateMachine.stateMachineArn,
        },
        statistic: "Sum",
        period: Duration.seconds(60),
      }),
      comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      threshold: 1,
    }).node.addDependency(stateMachine);

    /*
     This query is useful to check what a reasonable interval is for each product if you
     want the alarm to go off less than once a month.  Update the date range to get more current figures.

      with timegaps as(
      select
      product,
      if (print_options.product is null, null, if(print_options.product = 'GUARDIAN_WEEKLY', 'WEEKLY', 'NEWSPAPER')) print_product,
      payment_provider,
      e.event_timestamp,
      (lag(e.event_timestamp) over (partition by payment_provider, product order by event_timestamp)) as last_acquisition,
      from `datalake.fact_acquisition_event` e
      where 1=1
      and date(e.event_timestamp) >= date'2024-03-01' -- keep it after 1st March 2024 as the outage caused a S+ gap
      and payment_provider in ('STRIPE', 'GOCARDLESS', 'PAYPAL')
      and product in ('RECURRING_CONTRIBUTION', 'PRINT_SUBSCRIPTION', 'SUPPORTER_PLUS')
      )
      select
      product,
      print_product,
      payment_provider,
      max(timestamp_diff(event_timestamp, last_acquisition, HOUR)) max_diff,
      from timegaps
      group by 1,2,3
      order by 1,2,3
    */
    // Begin recurring contribution alarms (by payment method)
    const contributionAlarmConfig: Array<{
      paymentProvider: PaymentProvider;
      evaluationPeriods: number;
      periodDuration: Duration;
    }> = [
      {
        paymentProvider: PaymentProviders.PayPal,
        evaluationPeriods: 4,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.Stripe,
        evaluationPeriods: 3,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.DirectDebit,
        evaluationPeriods: 18,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.StripeApplePay,
        evaluationPeriods: 8,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.StripePaymentRequestButton,
        evaluationPeriods: 24,
        periodDuration: Duration.seconds(3600),
      },
    ];

    contributionAlarmConfig.forEach(
      ({ paymentProvider, evaluationPeriods, periodDuration }) => {
        new GuAlarm(this, `No${paymentProvider}ContributionsAlarm`, {
          app,
          actionsEnabled: isProd,
          snsTopicName: `alarms-handler-topic-${this.stage}`,
          alarmName: `support-workers ${this.stage} No successful recurring ${paymentProvider} contributions recently.`,
          metric: this.buildPaymentSuccessMetric(
            paymentProvider,
            ProductTypes.Contribution,
            periodDuration
          ),
          comparisonOperator:
            ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
          evaluationPeriods,
          treatMissingData: TreatMissingData.BREACHING,
          threshold: 0,
        }).node.addDependency(stateMachine);
      }
    );
    // End recurring contribution alarms (by payment method)

    // Begin S+ alarms (by payment method)
    const supporterPlusAlarmConfig: Array<{
      paymentProvider: PaymentProvider;
      evaluationPeriods: number;
      periodDuration: Duration;
    }> = [
      {
        paymentProvider: PaymentProviders.PayPal,
        evaluationPeriods: 6,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.Stripe,
        evaluationPeriods: 3,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.DirectDebit,
        evaluationPeriods: 18,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.StripeApplePay,
        evaluationPeriods: 12,
        periodDuration: Duration.seconds(3600),
      },
      {
        paymentProvider: PaymentProviders.StripePaymentRequestButton,
        evaluationPeriods: 24,
        periodDuration: Duration.seconds(3600),
      },
    ];
    supporterPlusAlarmConfig.forEach(
      ({ paymentProvider, evaluationPeriods, periodDuration }) => {
        new GuAlarm(this, `No${paymentProvider}SupporterPlusAlarm`, {
          app,
          actionsEnabled: isProd,
          snsTopicName: `alarms-handler-topic-${this.stage}`,
          alarmName: `support-workers ${this.stage} No successful ${paymentProvider} supporter plus subscriptions recently.`,
          metric: this.buildPaymentSuccessMetric(
            paymentProvider,
            ProductTypes.SupporterPlus,
            periodDuration
          ),
          comparisonOperator:
            ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
          evaluationPeriods,
          treatMissingData: TreatMissingData.BREACHING,
          threshold: 0,
        }).node.addDependency(stateMachine);
      }
    );
    // End S+ alarms (by payment method)

    // Begin Apple Pay alarm
    const applePayMetricDuration = Duration.minutes(5);
    const applePayEvaluationPeriods = 96; // The number of 5 minute periods in 8 hours
    const applePayAlarmPeriod = Duration.minutes(
      applePayMetricDuration.toMinutes() * applePayEvaluationPeriods
    );
    const applePayMetrics = Object.fromEntries(
      Object.values(ProductTypes).map((product, idx) => [
        `m${idx}`,
        this.buildPaymentSuccessMetric(
          PaymentProviders.StripeApplePay,
          product,
          applePayMetricDuration
        ),
      ])
    );
    const applePayExpression = `SUM([${Object.keys(applePayMetrics)
      .map((m) => `FILL(${m},0)`)
      .join(",")}])`;
    new GuAlarm(this, "NoApplePayRecurringAlarm", {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `support-workers ${
        this.stage
      } No successful recurring Apple Pay payments in ${applePayAlarmPeriod.toHumanString()}.`,
      metric: new MathExpression({
        expression: applePayExpression,
        label: "AllRecurringApplePayPayments",
        usingMetrics: applePayMetrics,
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: applePayEvaluationPeriods,
      treatMissingData: TreatMissingData.BREACHING,
      threshold: 0,
    }).node.addDependency(stateMachine);
    // End Apple Pay alarm

    // Begin Google Pay alarm
    const googlePayMetricDuration = Duration.minutes(5);
    const googlePayEvaluationPeriods = 180; // The number of 5 minute periods in 15 hours
    const googlePayAlarmPeriod = Duration.minutes(
      googlePayMetricDuration.toMinutes() * googlePayEvaluationPeriods
    );
    const googlePayMetrics = Object.fromEntries(
      Object.values(ProductTypes).map((product, idx) => [
        `m${idx}`,
        this.buildPaymentSuccessMetric(
          PaymentProviders.StripePaymentRequestButton,
          product,
          googlePayMetricDuration
        ),
      ])
    );
    const googlePayExpression = `SUM([${Object.keys(googlePayMetrics)
      .map((m) => `FILL(${m},0)`)
      .join(",")}])`;
    new GuAlarm(this, "NoGooglePayRecurringAlarm", {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `support-workers ${
        this.stage
      } No successful recurring Google Pay payments in ${googlePayAlarmPeriod.toHumanString()}.`,
      metric: new MathExpression({
        expression: googlePayExpression,
        label: "AllRecurringGooglePayPayments",
        usingMetrics: googlePayMetrics,
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: googlePayEvaluationPeriods,
      treatMissingData: TreatMissingData.BREACHING,
      threshold: 0,
    }).node.addDependency(stateMachine);
    // End Google Pay alarm

    // This alarm is for the PaymentSuccess metric where
    // ProductType == Paper AND PaymentProvider in [Stripe, Gocardless, Paypal]
    new GuAlarm(this, "NoPaperAcquisitionInOneDayAlarm", {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `URGENT 9-5 - ${this.stage} support-workers No successful paper checkouts in 24h.`,
      metric: new MathExpression({
        expression: "SUM([FILL(m1,0),FILL(m2,0),FILL(m3,0)])",
        label: "AllPaperConversions",
        usingMetrics: {
          m1: this.buildPaymentSuccessMetric(
            PaymentProviders.Stripe,
            ProductTypes.Paper,
            Duration.seconds(300)
          ),
          m2: this.buildPaymentSuccessMetric(
            PaymentProviders.DirectDebit,
            ProductTypes.Paper,
            Duration.seconds(300)
          ),
          m3: this.buildPaymentSuccessMetric(
            PaymentProviders.PayPal,
            ProductTypes.Paper,
            Duration.seconds(300)
          ),
        },
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 288,
      treatMissingData: TreatMissingData.BREACHING,
      threshold: 0,
    }).node.addDependency(stateMachine);

    new GuAlarm(this, "NoWeeklyAcquisitionInOneDayAlarm", {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `URGENT 9-5 - ${this.stage} support-workers No successful guardian weekly checkouts in 8h.`,
      metric: new MathExpression({
        label: "AllWeeklyConversions",
        expression: "SUM([FILL(m1,0),FILL(m2,0),FILL(m3,0)])",
        usingMetrics: {
          m1: this.buildPaymentSuccessMetric(
            PaymentProviders.Stripe,
            ProductTypes.GuardianWeekly,
            Duration.seconds(300)
          ),
          m2: this.buildPaymentSuccessMetric(
            PaymentProviders.DirectDebit,
            ProductTypes.GuardianWeekly,
            Duration.seconds(300)
          ),
          m3: this.buildPaymentSuccessMetric(
            PaymentProviders.PayPal,
            ProductTypes.GuardianWeekly,
            Duration.seconds(300)
          ),
        },
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 96,
      treatMissingData: TreatMissingData.BREACHING,
      threshold: 0,
    }).node.addDependency(stateMachine);

    const tierThreeMetricDuration = Duration.minutes(5);
    const tierThreeEvaluationPeriods = 288; // The number of 5 minute periods in 24 hours
    const tierThreeAlarmPeriod = Duration.minutes(
      tierThreeMetricDuration.toMinutes() * tierThreeEvaluationPeriods
    );
    new GuAlarm(this, `NoTierThreeAcquisitionInPeriodAlarm`, {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `URGENT 9-5 - ${
        this.stage
      } support-workers No successful Tier Three checkouts in ${tierThreeAlarmPeriod.toHumanString()}.`,
      metric: new MathExpression({
        label: "AllTierThreeConversions",
        expression: "SUM([FILL(m1,0),FILL(m2,0),FILL(m3,0)])",
        usingMetrics: {
          m1: this.buildPaymentSuccessMetric(
            PaymentProviders.Stripe,
            ProductTypes.TierThree,
            tierThreeMetricDuration
          ),
          m2: this.buildPaymentSuccessMetric(
            PaymentProviders.DirectDebit,
            ProductTypes.TierThree,
            tierThreeMetricDuration
          ),
          m3: this.buildPaymentSuccessMetric(
            PaymentProviders.PayPal,
            ProductTypes.TierThree,
            tierThreeMetricDuration
          ),
        },
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: tierThreeEvaluationPeriods,
      treatMissingData: TreatMissingData.BREACHING,
      threshold: 0,
    }).node.addDependency(stateMachine);

    // Begining of Ad-Lite
    const adLiteMetricDuration = Duration.minutes(5);
    const adLiteEvaluationPeriods = 144; // The number of 5 minute periods in 12 hours
    const adLiteAlarmPeriod = Duration.minutes(
      adLiteMetricDuration.toMinutes() * adLiteEvaluationPeriods
    );
    const adLiteMetrics = Object.fromEntries(
      Object.values(PaymentProviders).map((paymentProvider, idx) => [
        `m${idx}`,
        this.buildPaymentSuccessMetric(
          paymentProvider,
          ProductTypes.GuardianAdLite,
          adLiteMetricDuration
        ),
      ])
    );
    const adLiteExpression = `SUM([${Object.keys(adLiteMetrics)
      .map((m) => `FILL(${m},0)`)
      .join(",")}])`;
    new GuAlarm(this, `NoAdLiteAcquisitionInPeriodAlarm`, {
      app,
      actionsEnabled: isProd,
      snsTopicName: `alarms-handler-topic-${this.stage}`,
      alarmName: `URGENT 9-5 - ${
        this.stage
      } support-workers No successful Ad-Lite checkouts in ${adLiteAlarmPeriod.toHumanString()}.`,
      metric: new MathExpression({
        label: "AllGuardianAdLiteConversions",
        expression: adLiteExpression,
        usingMetrics: adLiteMetrics,
      }),
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: adLiteEvaluationPeriods,
      treatMissingData: TreatMissingData.BREACHING,
      threshold: 0,
    }).node.addDependency(stateMachine);
  }
  // End of Ad-Lite

  buildPaymentSuccessMetric = (
    paymentProvider: PaymentProvider,
    productType: ProductType,
    period: Duration
  ) => {
    return new Metric({
      metricName: "PaymentSuccess",
      namespace: "support-frontend",
      dimensionsMap: {
        PaymentProvider: paymentProvider,
        ProductType: productType,
        Stage: this.stage,
      },
      statistic: "Sum",
      period: period,
    });
  };
}
