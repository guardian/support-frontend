import type { Handler } from "aws-lambda";
import { stageFromEnvironment } from "../model/stage";
import type { BatchQueryResponse } from "../model/zuora";
import { ConfigService } from "../services/configService";
import { S3Service } from "../services/s3Service";
import { ZuoraQuerierService } from "../services/zuoraQuerierService";
import type {
  AddSupporterRatePlanItemToQueueState,
  FetchResultsState,
} from "./types";

interface FetchResultsDeps {
  getResults: (jobId: string) => Promise<BatchQueryResponse>;
  getResultFileResponse: (fileId: string) => Promise<Response>;
  uploadToS3: (
    stage: ReturnType<typeof stageFromEnvironment>,
    filename: string,
    body: Uint8Array,
    length: number
  ) => Promise<void>;
  putLastSuccessfulQueryTime: (time: string) => Promise<void>;
}

const toIsoLocalDateTimeUtc = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid attemptedQueryTime: ${isoString}`);
  }
  return date.toISOString().replace("Z", "");
};

const getValueOrThrow = <T>(value: T | undefined, errorMessage: string): T => {
  if (value === undefined) {
    throw new Error(errorMessage);
  }
  return value;
};

const buildDefaultDeps = async (): Promise<FetchResultsDeps> => {
  const stage = stageFromEnvironment();
  const configService = new ConfigService(stage);
  const config = await configService.loadZuoraConfig();
  const zuoraService = new ZuoraQuerierService(config);
  const s3Service = new S3Service();

  return {
    getResults: (jobId) => zuoraService.getResults(jobId),
    getResultFileResponse: (fileId) =>
      zuoraService.getResultFileResponse(fileId),
    uploadToS3: (uploadStage, filename, body, length) =>
      s3Service.streamToS3(uploadStage, filename, body, length),
    putLastSuccessfulQueryTime: (time) =>
      configService.putLastSuccessfulQueryTime(time),
  };
};

export const fetchResults = async (
  event: FetchResultsState,
  deps?: FetchResultsDeps
): Promise<AddSupporterRatePlanItemToQueueState> => {
  const stage = stageFromEnvironment();
  const resolvedDeps = deps ?? (await buildDefaultDeps());

  console.info("Attempting to fetch results", { jobId: event.jobId, stage });

  const result = await resolvedDeps.getResults(event.jobId);
  if (result.status !== "completed") {
    throw new Error(
      `Job with id ${event.jobId} is still in status ${result.status}`
    );
  }

  const batch = getValueOrThrow(
    result.batches[0],
    `No batches were returned in the batch query response for jobId ${event.jobId}`
  );
  const fileId = getValueOrThrow(
    batch.fileId,
    `Batch.fileId was missing in jobId ${event.jobId}`
  );

  const filename = `select-active-rate-plans-${toIsoLocalDateTimeUtc(
    event.attemptedQueryTime
  )}.csv`;

  const fileResponse = await resolvedDeps.getResultFileResponse(fileId);
  if (!fileResponse.ok) {
    throw new Error(
      `File download for job with id ${event.jobId} failed with http code ${fileResponse.status}`
    );
  }

  const contentLength = Number(fileResponse.headers.get("content-length") ?? 0);
  if (contentLength <= 0) {
    throw new Error(
      `Content length of the file for job with id ${event.jobId} is not > 0`
    );
  }

  const fileBytes = new Uint8Array(await fileResponse.arrayBuffer());
  await resolvedDeps.uploadToS3(stage, filename, fileBytes, contentLength);

  if (batch.recordCount === 0) {
    await resolvedDeps.putLastSuccessfulQueryTime(event.attemptedQueryTime);
  }

  console.info("Successfully wrote file to S3", {
    filename,
    recordCount: batch.recordCount,
    jobId: event.jobId,
  });

  return {
    filename,
    recordCount: batch.recordCount,
    processedCount: 0,
    attemptedQueryTime: event.attemptedQueryTime,
  };
};

export const handler: Handler<
  FetchResultsState,
  AddSupporterRatePlanItemToQueueState
> = async (event) => fetchResults(event);
