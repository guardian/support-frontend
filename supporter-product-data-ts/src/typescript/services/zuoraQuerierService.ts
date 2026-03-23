import type { BatchQueryRequest } from "../model/query";
import type { BatchQueryResponse } from "../model/zuora";
import type { ZuoraQuerierConfig } from "./configService";

export class ZuoraQuerierService {
  constructor(private readonly config: ZuoraQuerierConfig) {}

  private authHeaders(): HeadersInit {
    return {
      apiSecretAccessKey: this.config.password,
      apiAccessKeyId: this.config.username,
      "Accept-Encoding": "identity",
    };
  }

  async getResults(jobId: string): Promise<BatchQueryResponse> {
    const url = `${this.config.url.replace(
      /\/$/,
      ""
    )}/batch-query/jobs/${jobId}`;
    console.info("Zuora API request", { method: "GET", url });

    const response = await fetch(url, {
      method: "GET",
      headers: this.authHeaders(),
    });

    console.info("Zuora API response", {
      method: "GET",
      url,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zuora results for job ${jobId}: ${response.status}`
      );
    }

    const body = (await response.json()) as BatchQueryResponse;
    console.info("Zuora getResults response body", {
      jobId,
      status: body.status,
      batchCount: body.batches.length,
    });
    return body;
  }

  async getResultFileResponse(fileId: string): Promise<Response> {
    const url = `${this.config.url.replace(
      /\/$/,
      ""
    )}/batch-query/file/${fileId}`;
    console.info("Zuora API request", { method: "GET", url });

    const response = await fetch(url, {
      method: "GET",
      headers: this.authHeaders(),
    });

    console.info("Zuora API response", {
      method: "GET",
      url,
      status: response.status,
      ok: response.ok,
      contentLength: response.headers.get("content-length"),
    });

    return response;
  }

  async postQuery(request: BatchQueryRequest): Promise<BatchQueryResponse> {
    const url = `${this.config.url.replace(/\/$/, "")}/batch-query/`;
    console.info("Zuora API request", {
      method: "POST",
      url,
      body: JSON.stringify(request),
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...this.authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    console.info("Zuora API response", {
      method: "POST",
      url,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Zuora postQuery error response body", { errorBody });
      throw new Error(`Failed to submit Zuora query: ${response.status}`);
    }

    const body = (await response.json()) as BatchQueryResponse;
    console.info("Zuora postQuery response body", {
      id: body.id,
      status: body.status,
      batchCount: body.batches.length,
    });
    return body;
  }
}
