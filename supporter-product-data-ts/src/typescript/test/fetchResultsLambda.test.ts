import { fetchResults } from "../lambdas/fetchResultsLambda";

describe("fetchResults", () => {
  beforeEach(() => {
    process.env.STAGE = "CODE";
  });

  test("returns AddSupporterRatePlanItemToQueueState and uploads file", async () => {
    const uploadToS3 = jest.fn<
      Promise<void>,
      ["CODE" | "PROD", string, Uint8Array, number]
    >(async () => undefined);
    const putLastSuccessfulQueryTime = jest.fn(async () => undefined);

    const state = await fetchResults(
      {
        jobId: "job-123",
        attemptedQueryTime: "2026-03-09T10:30:00.000Z",
      },
      {
        getResults: async () => ({
          id: "job-123",
          status: "completed",
          batches: [
            {
              name: "batch-1",
              fileId: "file-abc",
              recordCount: 3,
              full: false,
            },
          ],
        }),
        getResultFileResponse: async () =>
          new Response("csv-data", {
            status: 200,
            headers: { "content-length": "8" },
          }),
        uploadToS3,
        putLastSuccessfulQueryTime,
      }
    );

    expect(state).toEqual({
      filename: "select-active-rate-plans-2026-03-09T10:30:00.000.csv",
      recordCount: 3,
      processedCount: 0,
      attemptedQueryTime: "2026-03-09T10:30:00.000Z",
    });

    expect(uploadToS3).toHaveBeenCalledTimes(1);
    expect(uploadToS3.mock.calls[0]?.[0]).toBe("CODE");
    expect(uploadToS3.mock.calls[0]?.[1]).toBe(
      "select-active-rate-plans-2026-03-09T10:30:00.000.csv"
    );
    expect(putLastSuccessfulQueryTime).not.toHaveBeenCalled();
  });

  test("updates lastSuccessfulQueryTime when no records are returned", async () => {
    const putLastSuccessfulQueryTime = jest.fn(async () => undefined);

    await fetchResults(
      {
        jobId: "job-456",
        attemptedQueryTime: "2026-03-09T11:00:00.000Z",
      },
      {
        getResults: async () => ({
          id: "job-456",
          status: "completed",
          batches: [
            {
              name: "batch-1",
              fileId: "file-xyz",
              recordCount: 0,
              full: false,
            },
          ],
        }),
        getResultFileResponse: async () =>
          new Response("csv-data", {
            status: 200,
            headers: { "content-length": "8" },
          }),
        uploadToS3: async () => undefined,
        putLastSuccessfulQueryTime,
      }
    );

    expect(putLastSuccessfulQueryTime).toHaveBeenCalledWith(
      "2026-03-09T11:00:00.000Z"
    );
  });

  test("throws when Zuora job is not completed", async () => {
    await expect(
      fetchResults(
        {
          jobId: "job-789",
          attemptedQueryTime: "2026-03-09T11:00:00.000Z",
        },
        {
          getResults: async () => ({
            id: "job-789",
            status: "executing",
            batches: [],
          }),
          getResultFileResponse: async () =>
            new Response(null, {
              status: 200,
              headers: { "content-length": "1" },
            }),
          uploadToS3: async () => undefined,
          putLastSuccessfulQueryTime: async () => undefined,
        }
      )
    ).rejects.toThrow("Job with id job-789 is still in status executing");
  });
});
