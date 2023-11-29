import { expect, test } from "@playwright/test";
import { email, firstName, lastName } from "./utils/users";
import { setTestUserDetails } from "./utils/testUserDetails";
import { checkRecaptcha } from "./utils/recaptcha";
import { fillInCardDetails } from "./utils/cardDetails";
import { fillInDirectDebitDetails } from "./utils/directDebitDetails";
import { fillInPayPalDetails } from "./utils/paypal";
import { setupPage } from "./utils/page";

interface TestDetails {
  paymentType: "Credit/Debit card" | "Direct debit" | "PayPal";
  frequency: "Monthly" | "Annual";
  country?: "US" | "AU";
}

const testsDetails: TestDetails[] = [
  { paymentType: "Credit/Debit card", frequency: "Monthly", country: "US" },
  { paymentType: "Credit/Debit card", frequency: "Monthly" },
  { paymentType: "Credit/Debit card", frequency: "Annual" },
  { paymentType: "Direct debit", frequency: "Monthly" },
  { paymentType: "Direct debit", frequency: "Annual" },
  { paymentType: "PayPal", frequency: "Monthly" },
];

test.describe("Sign up for a Recurring Contribution (Two-Step checkout)", () => {
  testsDetails.forEach((testDetails) => {
    test(`${testDetails.frequency} contribution checkout with ${
      testDetails.paymentType
    } - ${testDetails.country ?? "UK"}`, async ({ context, baseURL }) => {
      const page = await context.newPage();
      const testFirstName = firstName();
      const testLastName = lastName();
      const testEmail = email();
      setupPage(
        page,
        context,
        baseURL,
        `/${testDetails.country?.toLowerCase() || "uk"}/contribute`
      );
      await page.getByRole("tab").getByText(testDetails.frequency).click();
      await page.getByRole("button", { name: "Continue to checkout" }).click();
      await setTestUserDetails(page, testFirstName, testLastName, testEmail);
      if (testDetails.country === "US") {
        await page.getByLabel("State").type("NY");
        await page.getByLabel("ZIP code").type("90210");
      }
      await page.getByRole("radio", { name: testDetails.paymentType }).check();
      switch (testDetails.paymentType) {
        case "Credit/Debit card":
          await fillInCardDetails(page);
          break;
        case "Direct debit":
          await fillInDirectDebitDetails(page, "contribution");
          await checkRecaptcha(page);
          break;
        case "PayPal":
          const popupPagePromise = page.waitForEvent("popup");
          await page.locator("iframe[name^='xcomponent__ppbutton']").scrollIntoViewIfNeeded();
          await page
            .frameLocator("iframe[name^='xcomponent__ppbutton']")
            // this class gets added to the iframe body after the JavaScript has finished executing
            .locator("body.dom-ready")
            .locator('[role="button"]:has-text("Pay with")')
            .click({ delay: 2000 });
          const popupPage = await popupPagePromise;
          fillInPayPalDetails(popupPage);
          break;
      }
      if (
        testDetails.paymentType === "Credit/Debit card" ||
        testDetails.paymentType === "Direct debit"
      ) {
        await checkRecaptcha(page);
        await page.getByText(/Pay (£|\$)([0-9]+) per (month|year)/).click();
      }
      await expect(page).toHaveURL(
        `/${testDetails.country?.toLowerCase() || "uk"}/thankyou`,
        { timeout: 600000 }
      );
      await page.close();
    });
  });
});
