import {
  CloudWatchClient,
  PutMetricDataCommand,
} from "@aws-sdk/client-cloudwatch";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import type { Stage } from "../model/stage";

export class AlarmService {
  constructor(
    private readonly stage: Stage,
    private readonly client = new CloudWatchClient({
      region: "eu-west-1",
      credentials: defaultProvider(),
    })
  ) {}

  private async trigger(metricName: string): Promise<void> {
    await this.client.send(
      new PutMetricDataCommand({
        Namespace: "supporter-product-data",
        MetricData: [
          {
            MetricName: metricName,
            Value: 1,
            Unit: "Count",
            Dimensions: [{ Name: "Stage", Value: this.stage }],
          },
        ],
      })
    );
  }

  async triggerCsvReadAlarm(): Promise<void> {
    await this.trigger("CsvReadFailure");
  }

  async triggerDynamoWriteAlarm(): Promise<void> {
    await this.trigger("DynamoWriteFailure");
  }

  async triggerSqsWriteAlarm(): Promise<void> {
    await this.trigger("SqsWriteFailure");
  }
}
