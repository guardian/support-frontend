import { getPaymentFields } from '../helpers/ajax';

jest.mock('ophan', () => {});

describe('Regular Contributions Payment fields', () => {

  it('should create the correct payment field to handle direct debit', () => {
    const sortCode = '200000';
    const accountNumber = '55779911';
    const accountHolderName = 'Bart Simpson';
    const paymentFieldName = 'directDebitData';

    const expectedPaymentFields = {
      accountHolderName,
      sortCode,
      accountNumber,
    };
    const paymentFields = getPaymentFields(
      undefined,
      accountNumber,
      sortCode,
      accountHolderName,
      paymentFieldName,
    );

    expect(paymentFields.accountHolderName).toEqual(expectedPaymentFields.accountHolderName);
    expect(paymentFields.sortCode).toEqual(expectedPaymentFields.sortCode);
    expect(paymentFields.accountNumber).toEqual(expectedPaymentFields.accountNumber);
    expect(Object.keys(paymentFields).length).toEqual(3);
  });

  it('should create the correct payment field to handle PayPal', () => {

    const paymentFieldName = 'baid';
    const token = 'PayPalToken';

    const expectedPaymentFields = {
      baid: token,
    };
    const paymentFields = getPaymentFields(
      token,
      undefined,
      undefined,
      undefined,
      paymentFieldName,
    );

    expect(paymentFields.baid).toEqual(expectedPaymentFields.baid);
    expect(paymentFields.userId).toEqual(undefined);
    expect(Object.keys(paymentFields).length).toEqual(1);
  });

  it('should create the correct payment field to handle Stripe', () => {

    const paymentFieldName = 'stripeToken';
    const token = 'StripeToken';

    const expectedPaymentFields = {
      stripeToken: token,
    };
    const paymentFields = getPaymentFields(
      token,
      undefined,
      undefined,
      undefined,
      paymentFieldName,
    );

    expect(paymentFields.stripeToken).toEqual(expectedPaymentFields.stripeToken);
    expect(Object.keys(paymentFields).length).toEqual(1);
  });

  it('should return null if a unknown payment field name is passed', () => {

    const paymentFieldName = 'helloWorld';
    const token = 'PayPalToken';

    const paymentFields = getPaymentFields(
      token,
      undefined,
      undefined,
      undefined,
      paymentFieldName,
    );

    expect(paymentFields).toEqual(null);
  });
});
