import { ConfigService } from "../services/configService";

describe("ConfigService", () => {
  test("loads config from the same SSM path pattern as Scala service", async () => {
    const send = jest.fn().mockResolvedValue({
      Parameters: [
        {
          Name: "/supporter-product-data/CODE/zuora-config/url",
          Value: "https://example.com",
        },
        {
          Name: "/supporter-product-data/CODE/zuora-config/partnerId",
          Value: "partner",
        },
        {
          Name: "/supporter-product-data/CODE/zuora-config/username",
          Value: "user",
        },
        {
          Name: "/supporter-product-data/CODE/zuora-config/password",
          Value: "pass",
        },
      ],
    });

    const service = new ConfigService("CODE", { send } as never);
    const config = await service.loadZuoraConfig();

    expect(send).toHaveBeenCalledTimes(1);
    expect(config.url).toBe("https://example.com");
    expect(config.discountProductRatePlanIds).toEqual([
      "2c92c0f852f2ebb20152f9269f067819",
    ]);
  });
});
