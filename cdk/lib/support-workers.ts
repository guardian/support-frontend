import type { GuStackProps } from "@guardian/cdk/lib/constructs/core";
import { GuStack } from "@guardian/cdk/lib/constructs/core";
import {
  type GuFunctionProps,
  GuLambdaFunction,
} from "@guardian/cdk/lib/constructs/lambda";
import { type App, Duration, Fn } from "aws-cdk-lib";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Choice,
  Condition,
  Errors,
  Fail,
  Parallel,
  Pass,
  StateMachine,
  Succeed,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";

interface SupportWorkersProps extends GuStackProps {
  promotionsDynamoTables: string[];
  s3Files: string[];
  supporterProductDataTables: string[];
  eventBusArns: string[];
}
export class SupportWorkers extends GuStack {
  constructor(scope: App, id: string, props: SupportWorkersProps) {
    super(scope, id, props);

    const app = "support-workers";

    const lambdaDefaultConfig: Pick<
      GuFunctionProps,
      "app" | "memorySize" | "fileName" | "runtime" | "timeout" | "environment"
    > = {
      app,
      memorySize: 1024,
      fileName: `support-workers.jar`,
      runtime: Runtime.JAVA_21,
      timeout: Duration.seconds(300),
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

    const createLambda = (
      lambdaName: string,
      additionalPolicies: PolicyStatement[] = []
    ) => {
      const lambdaId = `${lambdaName}Lambda`;
      const lambda = new GuLambdaFunction(this, lambdaId, {
        ...lambdaDefaultConfig,
        handler: `com.gu.support.workers.lambdas.${lambdaName}::handleRequest`,
        functionName: `${this.stack}-${lambdaName}Lambda-${this.stage}`,
        environment: {
          ...lambdaDefaultConfig.environment,
        },
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

    const checkoutFailure = new Pass(this, "CheckoutFailure"); // This is a failed execution we don't want to alert on
    const failState = new Fail(this, "FailState"); // This is a failed execution we do want to alert on

    const succeedOrFailChoice = new Choice(this, "SucceedOrFailChoice")
      .when(
        Condition.booleanEquals("$.requestInfo.testUser", true),
        checkoutFailure
      )
      .when(Condition.booleanEquals("$.requestInfo.failed", true), failState)
      .otherwise(checkoutFailure);

    const failureHandler = createLambda("FailureHandler", [
      emailSqsPolicy,
    ]).next(succeedOrFailChoice);

    const catchProps = {
      resultPath: "$.error",
      errors: ["States.TaskFailed"],
    };

    const preparePaymentMethodForReuse = createLambda(
      "PreparePaymentMethodForReuse"
    ).addCatch(failureHandler, catchProps);

    const createPaymentMethodLambda = createLambda(
      "CreatePaymentMethod"
    ).addCatch(failureHandler, catchProps);

    const createSalesforceContactLambda = createLambda(
      "CreateSalesforceContact"
    ).addCatch(failureHandler, catchProps);

    const createZuoraSubscription = createLambda("CreateZuoraSubscription", [
      promotionsDynamoTablePolicy,
    ]).addCatch(failureHandler, catchProps);

    const sendThankYouEmail = createLambda("SendThankYouEmail", [
      emailSqsPolicy,
    ]);
    const updateSupporterProductData = createLambda(
      "UpdateSupporterProductData",
      [supporterProductDataTablePolicy]
    );
    const sendAcquisitionEvent = createLambda("SendAcquisitionEvent", [
      eventBusPolicy,
    ]);

    const shouldClonePaymentMethodChoice = new Choice(
      this,
      "ShouldClonePaymentMethodChoice"
    );
    const condition = Condition.booleanEquals(
      "$.requestInfo.accountExists",
      true
    );
    const checkoutSuccess = new Succeed(this, "CheckoutSuccess");

    const parallelSteps = new Parallel(this, "Parallel")
      .branch(sendThankYouEmail)
      .branch(updateSupporterProductData)
      .branch(sendAcquisitionEvent)
      .branch(checkoutSuccess);

    const commonDefinition = createZuoraSubscription.next(parallelSteps);

    const definitionWithExistingAccount =
      preparePaymentMethodForReuse.next(commonDefinition);

    const definitionWithNewAccount = createPaymentMethodLambda
      .next(createSalesforceContactLambda)
      .next(commonDefinition);

    const definition = shouldClonePaymentMethodChoice
      .when(condition, definitionWithExistingAccount)
      .otherwise(definitionWithNewAccount);

    const stateMachine = new StateMachine(this, "SupportWorkers", {
      stateMachineName: `${app}-${this.stage}`,
      definition: definition,
    });

    this.overrideLogicalId(stateMachine, {
      logicalId: `SupportWorkers${this.stage}`,
      reason: "Moving existing step function to CDK",
    });
  }
}
