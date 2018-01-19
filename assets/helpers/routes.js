// @flow

// ----- Routes ----- //

const routes: {
  [string]: string,
} = {
  recurringContribCheckout: '/contribute/recurring',
  recurringContribThankyou: '/contribute/recurring/thankyou',
  recurringContribCreate: '/contribute/recurring/create',
  recurringContribPending: '/contribute/recurring/pending',
  contributionsSendMarketing: '/contribute/send-marketing',
  oneOffContribCheckout: '/contribute/one-off',
  oneOffContribThankyou: '/contribute/one-off/thankyou',
  oneOffContribAutofill: '/contribute/one-off/autofill',
  contributionsMarketingConfirm: '/contribute/marketing-confirm',
  payPalSetupPayment: '/paypal/setup-payment',
  payPalCreateAgreement: '/paypal/create-agreement',
  directDebitCheckAccount: '/directDebit/checkAccount',
};


// ----- Exports ----- //

export {
  routes,
};
