import type { Handler } from "aws-lambda";
import type { BatchQueryRequest, ZoqlExportQuery } from "../model/query";
import { type Stage, stageFromEnvironment } from "../model/stage";
import {
  ConfigService,
  type ZuoraQuerierConfig,
} from "../services/configService";
import {
  buildSelectActiveRatePlansQuery,
  selectActiveRatePlansQueryName,
} from "../services/selectActiveRatePlansQuery";
import { ZuoraQuerierService } from "../services/zuoraQuerierService";
import type { FetchResultsState, QueryType, QueryZuoraState } from "./types";

const formatZuoraDateTime = (date: Date): string => {
  const pad = (value: number): string => value.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds()
  )}`;
};

const localIsoForQueryName = (date: Date): string =>
  date.toISOString().replace("Z", "");

const buildBatchQueryRequest = (
  queryType: QueryType,
  config: ZuoraQuerierConfig
): BatchQueryRequest => {
  const now = new Date();

  let incrementalTime: string | undefined;

  if (queryType === "full") {
    const twentyYearsAgo = new Date(now);
    twentyYearsAgo.setUTCFullYear(twentyYearsAgo.getUTCFullYear() - 20);
    incrementalTime = formatZuoraDateTime(twentyYearsAgo);
  } else {
    incrementalTime =
      config.lastSuccessfulQueryTime === undefined
        ? undefined
        : formatZuoraDateTime(new Date(config.lastSuccessfulQueryTime));
  }

  const queries: ZoqlExportQuery[] = [
    {
      name: `${selectActiveRatePlansQueryName}-${localIsoForQueryName(now)}`,
      query: buildSelectActiveRatePlansQuery(config.discountProductRatePlanIds),
      type: "zoqlexport",
    },
  ];

  return {
    partner: config.partnerId,
    incrementalTime,
    name: "supporter-product-data",
    queries,
    format: "csv",
    version: "1.1",
    project: "supporter-product-data",
    encrypted: "none",
    useQueryLabels: "true",
    dateTimeUtc: "true",
  };
};

const attemptedQueryTime = (): string => {
  const time = new Date();
  time.setUTCMinutes(time.getUTCMinutes() - 1);
  return time.toISOString();
};

export const queryZuora = async (
  stage: Stage,
  queryType: QueryType
): Promise<FetchResultsState> => {
  const configService = new ConfigService(stage);
  const config = await configService.loadZuoraConfig();
  const service = new ZuoraQuerierService(config);

  console.info("Attempting to submit query to Zuora", { stage, queryType });

  const request = buildBatchQueryRequest(queryType, config);
  const result = await service.postQuery(request);

  console.info("Successfully submitted query", {
    jobId: result.id,
    queryType,
    stage,
  });

  return {
    jobId: result.id,
    attemptedQueryTime: attemptedQueryTime(),
  };
};

export const handler: Handler<QueryZuoraState, FetchResultsState> = async (
  event
) => queryZuora(stageFromEnvironment(), event.queryType);
