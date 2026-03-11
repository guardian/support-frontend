import type { Context, Handler } from "aws-lambda";
import { stageFromEnvironment } from "../model/stage";
import type { SupporterRatePlanItem } from "../model/supporterRatePlanItem";
import { supporterRatePlanItemFromCsvRow } from "../model/supporterRatePlanItem";
import { AlarmService } from "../services/alarmService";
import { ConfigService } from "../services/configService";
import { parseCsvWithHeader } from "../services/csvService";
import { S3Service } from "../services/s3Service";
import { SqsService } from "../services/sqsService";
import type { AddSupporterRatePlanItemToQueueState } from "./types";

const maxBatchSize = 5;
const timeoutBufferInMillis = maxBatchSize * 5 * 1000;

type IndexedItem = [SupporterRatePlanItem, number];

interface AddToQueueDeps {
  readCsv: (filename: string) => Promise<string>;
  sendBatch: (batch: IndexedItem[]) => Promise<void>;
  triggerCsvReadAlarm: () => Promise<void>;
  triggerSqsWriteAlarm: () => Promise<void>;
  putLastSuccessfulQueryTime: (time: string) => Promise<void>;
}

const buildDeps = (): AddToQueueDeps => {
  const stage = stageFromEnvironment();
  const s3Service = new S3Service();
  const queueUrl = process.env.QUEUE_URL;
  if (queueUrl === undefined) {
    throw new Error("QUEUE_URL must be set");
  }

  const sqsService = new SqsService(queueUrl);
  const alarmService = new AlarmService(stage);
  const configService = new ConfigService(stage);

  return {
    readCsv: (filename) => s3Service.getObjectAsString(stage, filename),
    sendBatch: (batch) => sqsService.sendBatch(batch),
    triggerCsvReadAlarm: () => alarmService.triggerCsvReadAlarm(),
    triggerSqsWriteAlarm: () => alarmService.triggerSqsWriteAlarm(),
    putLastSuccessfulQueryTime: (time) =>
      configService.putLastSuccessfulQueryTime(time),
  };
};

const decodeRows = (
  rows: Array<Record<string, string>>,
  processedCount: number
): { validRows: IndexedItem[]; failedRowIndexes: number[] } => {
  const validRows: IndexedItem[] = [];
  const failedRowIndexes: number[] = [];

  rows.slice(processedCount).forEach((row, index) => {
    const itemIndex = processedCount + index;
    try {
      validRows.push([
        supporterRatePlanItemFromCsvRow(row, itemIndex + 2),
        itemIndex,
      ]);
    } catch {
      failedRowIndexes.push(itemIndex);
    }
  });

  return { validRows, failedRowIndexes };
};

const grouped = <T>(items: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
};

const writeBatchesUntilTimeout = async (
  processedCount: number,
  batches: IndexedItem[][],
  getRemainingTimeInMillis: () => number,
  deps: Pick<AddToQueueDeps, "sendBatch" | "triggerSqsWriteAlarm">
): Promise<number> => {
  let latestProcessedCount = processedCount;

  for (const batch of batches) {
    if (getRemainingTimeInMillis() < timeoutBufferInMillis) {
      console.info("Aborting processing due to remaining lambda time", {
        remainingMillis: getRemainingTimeInMillis(),
        timeoutBufferInMillis,
      });
      return latestProcessedCount;
    }

    try {
      await deps.sendBatch(batch);
    } catch (error) {
      console.error("Failed to write SQS batch", error);
      await deps.triggerSqsWriteAlarm();
    }

    const highestProcessedIndex = batch[batch.length - 1]?.[1];
    if (highestProcessedIndex !== undefined) {
      latestProcessedCount = highestProcessedIndex + 1;
    }
  }

  return latestProcessedCount;
};

export const addToQueue = async (
  state: AddSupporterRatePlanItemToQueueState,
  getRemainingTimeInMillis: () => number,
  deps: AddToQueueDeps
): Promise<AddSupporterRatePlanItemToQueueState> => {
  console.info("Starting to add subscriptions to queue", {
    filename: state.filename,
    recordCount: state.recordCount,
    processedCount: state.processedCount,
  });

  const csvContent = await deps.readCsv(state.filename);
  const rows = parseCsvWithHeader(csvContent);

  if (rows.length === 0) {
    await deps.triggerCsvReadAlarm();
    throw new Error(`The specified CSV file ${state.filename} was empty`);
  }

  const { validRows, failedRowIndexes } = decodeRows(
    rows,
    state.processedCount
  );

  if (failedRowIndexes.length > 0) {
    await deps.triggerCsvReadAlarm();
    throw new Error(
      `there were ${failedRowIndexes.length} read failures from file ${
        state.filename
      } with line numbers ${failedRowIndexes.join(",")}`
    );
  }

  const batches = grouped(validRows, 10);
  const processedCount = await writeBatchesUntilTimeout(
    state.processedCount,
    batches,
    getRemainingTimeInMillis,
    deps
  );

  if (processedCount === state.recordCount) {
    await deps.putLastSuccessfulQueryTime(state.attemptedQueryTime);
  }

  return {
    ...state,
    processedCount,
  };
};

const fromContext =
  (context: Context): (() => number) =>
  () =>
    context.getRemainingTimeInMillis();

export const handler: Handler<
  AddSupporterRatePlanItemToQueueState,
  AddSupporterRatePlanItemToQueueState
> = async (state, context) =>
  addToQueue(state, fromContext(context), buildDeps());
