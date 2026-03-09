import { addToQueue } from "../lambdas/addSupporterRatePlanItemToQueueLambda";

describe("addSupporterRatePlanItemToQueueLambda", () => {
  test("sends records in batches and updates processedCount", async () => {
    const sendBatch = jest.fn(async () => undefined);
    const putLastSuccessfulQueryTime = jest.fn(async () => undefined);

    const csv = [
      "Subscription.Name,Account.IdentityId__c,ProductRatePlan.Id,ProductRatePlan.Name,Subscription.TermEndDate,Subscription.ContractEffectiveDate",
      "sub-1,id-1,prp-1,plan-1,2026-03-01,2026-02-01",
      "sub-2,id-2,prp-2,plan-2,2026-03-02,2026-02-02",
    ].join("\n");

    const result = await addToQueue(
      {
        filename: "file.csv",
        recordCount: 2,
        processedCount: 0,
        attemptedQueryTime: "2026-03-01T00:00:00.000Z",
      },
      () => 120000,
      {
        readCsv: async () => csv,
        sendBatch,
        triggerCsvReadAlarm: async () => undefined,
        triggerSqsWriteAlarm: async () => undefined,
        putLastSuccessfulQueryTime,
      }
    );

    expect(sendBatch).toHaveBeenCalledTimes(1);
    expect(result.processedCount).toBe(2);
    expect(putLastSuccessfulQueryTime).toHaveBeenCalledWith(
      "2026-03-01T00:00:00.000Z"
    );
  });

  test("throws and triggers alarm for empty CSV", async () => {
    const triggerCsvReadAlarm = jest.fn(async () => undefined);

    await expect(
      addToQueue(
        {
          filename: "file.csv",
          recordCount: 1,
          processedCount: 0,
          attemptedQueryTime: "2026-03-01T00:00:00.000Z",
        },
        () => 120000,
        {
          readCsv: async () => "",
          sendBatch: async () => undefined,
          triggerCsvReadAlarm,
          triggerSqsWriteAlarm: async () => undefined,
          putLastSuccessfulQueryTime: async () => undefined,
        }
      )
    ).rejects.toThrow("was empty");

    expect(triggerCsvReadAlarm).toHaveBeenCalledTimes(1);
  });
});
