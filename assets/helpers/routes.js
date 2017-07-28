// @flow

// ----- Routes ----- //

const routes: {
  [string]: string,
} = {
  recurringContribCheckout: '/contribute/recurring',
  recurringContribThankyou: '/contribute/recurring/thankyou',
  recurringContribCreate: '/contribute/recurring/create',
  recurringContribPending: '/contribute/recurring/pending',
  oneOffContribCheckout: '/contribute/one-off',
  oneOffContribThankyou: '/contribute/one-off/thankyou',
  oneOffContribAutofill: '/contribute/one-off/autofill',
  payPalSetupPayment: '/paypal/setup-payment',
  payPalCreateAgreement: '/paypal/create-agreement',
};


// ----- Exports ----- //

export {
  routes,
};
