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
  Parallel,
  Pass,
  StateMachine,
} from "aws-cdk-lib/aws-stepfunctions";
import { LambdaInvoke } from "aws-cdk-lib/aws-stepfunctions-tasks";

interface SupportWorkersProps extends GuStackProps {
  promotionsDynamoTables: string[];
  s3Files: string[];
  supporterProductDataTables: string[];
  kinesisStreamArn: string;
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

    // const lambdaExecutionRole = new Role(this, "LambdaExecutionRole", {
    //   assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    //
    // });
    const s3Policy = new PolicyStatement({
      actions: ["s3:GetObject"],
      resources: props.s3Files,
    });
    const sqsPolicy = new PolicyStatement({
      actions: ["sqs:GetQueueUrl", "sqs:SendMessage"],
      resources: [`comms-${this.stage}-EmailQueueArn`],
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
    // TODO: I think this could be removed now we have the event bus?
    // const kinesisPolicy = new PolicyStatement({
    //   actions: ["kinesis:*"],
    //   resources: [props.kinesisStreamArn],
    // });
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
      resources: props.supporterProductDataTables,
    });

    const createLambda = (
      lambdaName: string,
      additionalPolicies: PolicyStatement[] = []
    ) =>
      new LambdaInvoke(this, lambdaName, {
        lambdaFunction: new GuLambdaFunction(this, `${lambdaName}Lambda`, {
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
        }),
      });

    const failureHandler = createLambda("FailureHandler");
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

    const sendThankYouEmail = createLambda("SendThankYouEmail", [sqsPolicy]);
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
    const checkoutSuccess = new Pass(this, "CheckoutSuccess");
    const parallelSteps = new Parallel(this, "Parallel")
      .branch(sendThankYouEmail)
      .branch(updateSupporterProductData)
      .branch(sendAcquisitionEvent)
      .branch(checkoutSuccess);

    const definitionWithExistingAccount = preparePaymentMethodForReuse
      .next(createZuoraSubscription)
      .next(parallelSteps);

    const definitionWithNewAccount = createPaymentMethodLambda
      .next(createSalesforceContactLambda)
      .next(definitionWithExistingAccount);

    const definition = shouldClonePaymentMethodChoice
      .when(condition, definitionWithExistingAccount)
      .otherwise(definitionWithNewAccount);

    new StateMachine(this, "SupportWorkers", {
      stateMachineName: `${app}-${this.stage}`,
      definition: definition,
    });
  }
}
