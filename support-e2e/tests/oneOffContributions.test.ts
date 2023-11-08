import { expect, test } from "@playwright/test";
import { email, firstName } from "./utils/users";
import { checkRecaptcha } from "./utils/recaptcha";
import { fillInCardDetails } from "./utils/cardDetails";
import { fillInPayPalDetails } from "./utils/paypal";
import { setupPage } from "./utils/page";

interface TestDetails {
  paymentType: "Credit/Debit card" | "PayPal";
  customAmount?: string;
}

const testsDetails: TestDetails[] = [
  { paymentType: "Credit/Debit card", customAmount: "22.55" },
  { paymentType: "PayPal" },
];

test.describe("Sign up for a one-off contribution", () => {
  testsDetails.forEach((testDetails) => {
    test(`One off contribution ${
      testDetails.customAmount
        ? `with custom amount ${testDetails.customAmount} `
        : ""
    }checkout with ${testDetails.paymentType} - GBP`, async ({
      context,
      baseURL,
    }) => {
      const page = await context.newPage();
      setupPage(page, context, baseURL, "/uk/contribute", firstName());
      await page.getByRole("tab").getByText("One-time").click();
      if (testDetails.customAmount) {
        await page.locator("label[for='amount-other']").click();
        await page.getByLabel("Enter your amount").type("22.55");
      }
      await page.getByRole("button", { name: "Continue to checkout" }).click();
      await page.getByLabel("Email address").type(email());
      await page.getByRole("radio", { name: testDetails.paymentType }).click();
      switch (testDetails.paymentType) {
        case "Credit/Debit card":
          await fillInCardDetails(page);
          await checkRecaptcha(page);
          await page.locator('button:has-text("Support us with")').click();
          break;
        case "PayPal":
          await page.getByText(/Pay (£|\$)([0-9]+) with PayPal/).click();
          await expect(page).toHaveURL(/.*paypal.com/);
          fillInPayPalDetails(page);
          break;
      }
      await expect(page).toHaveURL(/\/uk\/thankyou/);
      context.pages().forEach(async (page) => {
        await page.close();
      });
    });
  });
});
