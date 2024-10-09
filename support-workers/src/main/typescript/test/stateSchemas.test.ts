import {
  CreatePaymentMethodState,
  createPaymentMethodStateSchema,
  StripePaymentFields,
} from "../stateSchemas";
import supporterPlusAnnualEurJson from "./fixtures/supporterPlusAnnualEUR.json";
import contributionMonthlyUsdJson from "./fixtures/contributionMonthlyUSD.json";
test("ChargedThroughDate is null in the model when it is null in Zuora", async () => {
  const supporterPlus = createPaymentMethodStateSchema.parse(
    supporterPlusAnnualEurJson
  );
  expect(supporterPlus.product.currency).toBe("EUR");
  expect(supporterPlus.acquisitionData?.ophanIds.pageviewId).toBe(
    "m21r1npxieyqa3kn5gxh"
  );

  const contribution: CreatePaymentMethodState =
    createPaymentMethodStateSchema.parse(contributionMonthlyUsdJson);
  expect(contribution.product.currency).toBe("USD");
  expect(contribution.product.productType).toBe("Contribution");
  if (contribution.product.productType === "Contribution") {
    expect(contribution.product.amount).toBe(5);
  }
  const paymentFields = contribution.paymentFields as StripePaymentFields; //TODO should be a discriminated union
  expect(paymentFields.stripePaymentType).toBe("StripePaymentRequestButton");
});
