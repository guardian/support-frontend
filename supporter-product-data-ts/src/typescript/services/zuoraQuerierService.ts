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
    const response = await fetch(
      `${this.config.url.replace(/\/$/, "")}/batch-query/jobs/${jobId}`,
      {
        method: "GET",
        headers: this.authHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Zuora results for job ${jobId}: ${response.status}`
      );
    }

    return (await response.json()) as BatchQueryResponse;
  }

  async getResultFileResponse(fileId: string): Promise<Response> {
    return fetch(
      `${this.config.url.replace(/\/$/, "")}/batch-query/file/${fileId}`,
      {
        method: "GET",
        headers: this.authHeaders(),
      }
    );
  }

  async postQuery(request: BatchQueryRequest): Promise<BatchQueryResponse> {
    const response = await fetch(
      `${this.config.url.replace(/\/$/, "")}/batch-query/`,
      {
        method: "POST",
        headers: {
          ...this.authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to submit Zuora query: ${response.status}`);
    }

    return (await response.json()) as BatchQueryResponse;
  }
}
