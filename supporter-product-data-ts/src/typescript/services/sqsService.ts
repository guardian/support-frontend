import { SendMessageBatchCommand, SQSClient } from "@aws-sdk/client-sqs";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import type { SupporterRatePlanItem } from "../model/supporterRatePlanItem";

export class SqsService {
  constructor(
    private readonly queueUrl: string,
    private readonly client = new SQSClient({
      region: "eu-west-1",
      credentials: defaultProvider(),
    })
  ) {}

  async sendBatch(
    items: Array<[SupporterRatePlanItem, number]>
  ): Promise<void> {
    console.info("Sending batch to SQS", {
      queueUrl: this.queueUrl,
      itemCount: items.length,
    });

    const result = await this.client.send(
      new SendMessageBatchCommand({
        QueueUrl: this.queueUrl,
        Entries: items.map(([item, index]) => ({
          Id: index.toString(),
          MessageBody: JSON.stringify(item),
        })),
      })
    );

    const failedCount = (result.Failed ?? []).length;
    const succeededCount = (result.Successful ?? []).length;
    console.info("SQS batch result", {
      queueUrl: this.queueUrl,
      succeededCount,
      failedCount,
    });

    if (failedCount > 0) {
      const failures = (result.Failed ?? [])
        .map(
          (failed) => `${failed.Id ?? "unknown"}:${failed.Message ?? "unknown"}`
        )
        .join(", ");
      throw new Error(`Error writing message batch to SQS: ${failures}`);
    }
  }
}
