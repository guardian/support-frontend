/**
 * @group integration
 */

import { handler } from "../lambdas/queryZuoraLambda";

jest.mock("../services/configService", () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    loadZuoraConfig: jest.fn().mockResolvedValue({
      url: "https://example.com",
      partnerId: "partner",
      username: "user",
      password: "pass",
      discountProductRatePlanIds: [],
    }),
  })),
}));

describe("queryZuoraLambda integration", () => {
  test("returns a fetch-results state payload", async () => {
    process.env.STAGE = "CODE";

    const result = await handler(
      { queryType: "incremental" },
      {} as never,
      () => undefined
    );

    expect(result?.jobId).toContain("mock-job-");
    expect(result?.attemptedQueryTime).toBeDefined();
  });
});
