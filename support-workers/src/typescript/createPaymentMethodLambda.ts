import type {
  CreatePaymentMethodState,
  CreateSalesforceContactState,
} from "./stateSchemas";

export const handler = async (
  state: CreatePaymentMethodState
): Promise<CreateSalesforceContactState> => {
  console.log(`Input is ${JSON.stringify(state)}`);
  return Promise.resolve({
    ...state,
    paymentMethod: {
      Type: "PayPal",
      PaypalBaid: "123",
      PaypalEmail: "test@test.com",
      PaypalType: "ExpressCheckout",
      PaymentGateway: "PayPal Express",
    },
  });
};
