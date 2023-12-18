import "dotenv/config";
import { expect, test } from "@playwright/test";
import { email, firstName, lastName } from "./utils/users";
import { checkRecaptcha } from "./utils/recaptcha";
import { fillInCardDetails } from "./utils/cardDetails";
import { fillInDirectDebitDetails } from "./utils/directDebitDetails";
import { fillInPayPalDetails } from "./utils/paypal";
import { setupPage } from "./utils/page";
import { afterEachTasks } from "./utils/afterEachTest";

type PaymentType = "Credit/Debit card" | "Direct debit" | "PayPal";

interface TestDetails {
  frequency: "Monthly" | "Quarterly" | "Annual";
  paymentType: PaymentType;
}

interface TestDetailsGifted {
  frequency: "3 months" | "12 months";
  paymentType: PaymentType;
}

const testsDetails: TestDetails[] = [
  {
    frequency: "Monthly",
    paymentType: "Credit/Debit card",
  },
  {
    frequency: "Monthly",
    paymentType: "Direct debit",
  },
  {
    frequency: "Monthly",
    paymentType: "PayPal",
  },
  {
    frequency: "Quarterly",
    paymentType: "Credit/Debit card",
  },
  {
    frequency: "Quarterly",
    paymentType: "Direct debit",
  },
  {
    frequency: "Annual",
    paymentType: "Credit/Debit card",
  },
  {
    frequency: "Annual",
    paymentType: "Direct debit",
  },
];

const testsDetailsGifted: TestDetailsGifted[] = [
  {
    frequency: "3 months",
    paymentType: "Credit/Debit card",
  },
  {
    frequency: "3 months",
    paymentType: "Direct debit",
  },
  {
    frequency: "12 months",
    paymentType: "Credit/Debit card",
  },
  {
    frequency: "12 months",
    paymentType: "Direct debit",
  },
  {
    frequency: "3 months",
    paymentType: "PayPal",
  },
];

afterEachTasks(test);

test.describe("Sign up for a Guardian Weekly subscription", () => {
  testsDetails.forEach((testDetails) => {
    test(`Guardian Weekly - ${testDetails.frequency} - ${testDetails.paymentType} - GBP`, async ({
      context,
      baseURL,
    }) => {
      const page = await context.newPage();
      const testFirstName = firstName();
      const testEmail = email();
      setupPage(page, context, baseURL, "/uk/subscribe/weekly");
      await page
        .locator(`a[aria-label='${testDetails.frequency}- Subscribe now']`)
        .click();
      await page.getByLabel("title").selectOption("Ms");
      await page.getByLabel("First name").fill(testFirstName);
      await page.getByLabel("Last name").fill(lastName());
      await page.getByLabel("Email", { exact: true }).fill(testEmail);
      await page.getByLabel("Confirm email").fill(testEmail);
      await page.getByLabel("Address Line 1").fill("Kings Place");
      await page.getByLabel("Address Line 2").fill("Kings Cross");
      await page.getByLabel("Town/City").fill("London");
      await page.getByLabel("Postcode").last().fill("N1 9GU");
      await page.getByRole("radio", { name: testDetails.paymentType }).check();
      switch (testDetails.paymentType) {
        case "Credit/Debit card":
          await fillInCardDetails(page);
          await checkRecaptcha(page);
          await page.locator('button:has-text("Pay now")').click();
          break;
        case "Direct debit":
          await fillInDirectDebitDetails(page, "subscription");
          await page.locator('button:has-text("Confirm")').click();
          await checkRecaptcha(page);
          await page.locator('button:has-text("Subscribe")').click();
          break;
        case "PayPal":
          const popupPagePromise = page.waitForEvent("popup");
          await page.locator("iframe[name^='xcomponent__ppbutton']").scrollIntoViewIfNeeded();
          await page
            .frameLocator("iframe[name^='xcomponent__ppbutton']")
            // this class gets added to the iframe body after the JavaScript has finished executing
            .locator("body.dom-ready")
            .getByRole("button", { name: "PayPal" })
            .click({ delay: 2000 });

          const popupPage = await popupPagePromise;
          fillInPayPalDetails(popupPage);
          break;
      }

      const getSuccessPackageTitle = () => {
        switch (testDetails.frequency) {
          case "Quarterly":
            return " / quarterly package";

          case "Annual":
            return " / annual package";

          default:
            return "";
        }
      };

      const subscribedMessage = `You have now subscribed to the Guardian Weekly${getSuccessPackageTitle()}`;
      const processingSubscriptionMessage = `Your subscription to the Guardian Weekly${getSuccessPackageTitle()} is being processed`;
      const successMsgRegex = new RegExp(
        `${processingSubscriptionMessage}|${subscribedMessage}`
      );

      await expect(
        page.getByRole("heading", { name: successMsgRegex })
      ).toBeVisible();

    });
  });
});

test.describe("Gifted subscriptions", () => {
  testsDetailsGifted.forEach((testDetails) => {
    test(`Guardian Weekly - Gifted - ${testDetails.frequency} - ${testDetails.paymentType} - GBP`, async ({
      page,
      context,
      baseURL,
    }) => {
      const testFirstName = firstName();
      const testLastName = lastName();
      const testEmail = email();
      setupPage(page, context, baseURL, "/uk/subscribe/weekly/gift");
      await page
        .locator(`a[aria-label='${testDetails.frequency}- Subscribe now']`)
        .click();
      const gifteeDetails = await page
        .getByText("Gift recipient's details", { exact: true })
        .locator("..");
      await gifteeDetails.getByLabel("title").selectOption("Mr");
      await gifteeDetails
        .getByLabel("First name")
        .fill(`${testFirstName}-giftee`);
      await gifteeDetails
        .getByLabel("Last name")
        .fill(`${testLastName}-giftee`);
      await gifteeDetails.getByLabel("Email").fill(`giftee-${testEmail}`);

      const gifteeAddress = await page
        .getByText("Gift recipient's address", { exact: true })
        .locator("..");
      await gifteeAddress
        .getByLabel("Address Line 1")
        .fill("Kings Place - giftee");
      await gifteeAddress.getByLabel("Address Line 2").fill("Kings Cross");
      await gifteeAddress.getByLabel("Town/City").fill("London");
      await gifteeAddress.getByLabel("Postcode").last().fill("N1 9GU");

      const yourDetails = await page
        .getByText("Your details", { exact: true })
        .locator("..");
      await yourDetails.getByLabel("First name").fill(testFirstName);
      await yourDetails.getByLabel("Last name").fill(testLastName);
      await yourDetails.getByLabel("Email", { exact: true }).fill(testEmail);
      await yourDetails
        .getByLabel("Confirm email", { exact: true })
        .fill(testEmail);
      await page.getByRole("radio", { name: testDetails.paymentType }).check();

      switch (testDetails.paymentType) {
        case "Credit/Debit card":
          await fillInCardDetails(page);
          await checkRecaptcha(page);
          await page.locator('button:has-text("Pay now")').click();
          break;
        case "Direct debit":
          await fillInDirectDebitDetails(page, "subscription");
          await page.locator('button:has-text("Confirm")').click();
          await checkRecaptcha(page);
          await page.locator('button:has-text("Subscribe")').click();
          break;
        case "PayPal":
          const popupPagePromise = page.waitForEvent("popup");
          await page.locator("iframe[name^='xcomponent__ppbutton']").scrollIntoViewIfNeeded();
          await page
            .frameLocator("iframe[name^='xcomponent__ppbutton']")
            // this class gets added to the iframe body after the JavaScript has finished executing
            .locator("body.dom-ready")
            .getByRole("button", { name: "PayPal" })
            .click({ delay: 2000 });

          const popupPage = await popupPagePromise;
          fillInPayPalDetails(popupPage);
          break;
      }

      const subscribedMessage =
        "Your purchase of a Guardian Weekly gift subscription is now complete";
      const processingSubscriptionMessage =
        "Your Guardian Weekly gift subscription is being processed";
      const successMsgRegex = new RegExp(
        `${processingSubscriptionMessage}|${subscribedMessage}`
      );

      await expect(
        page.getByRole("heading", { name: successMsgRegex })
      ).toBeVisible();

    });
  });
});
