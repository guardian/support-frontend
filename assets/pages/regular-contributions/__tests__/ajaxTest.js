import { getPaymentFields } from '../helpers/ajax';

jest.mock('ophan', () => {});

describe('Regular Contributions Payment fields', () => {

  it('should create the correct payment field to handle direct debit', () => {
    const sortCode = '200000';
    const accountNumber = '55779911';
    const accountHolderName = 'Bart Simpson';
    const paymentFieldName = 'directDebitData';
    const userId = '123456';

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
      userId,
    );

    expect(paymentFields.accountHolderName).toEqual(expectedPaymentFields.accountHolderName);
    expect(paymentFields.sortCode).toEqual(expectedPaymentFields.sortCode);
    expect(paymentFields.accountNumber).toEqual(expectedPaymentFields.accountNumber);

  });

  it('should create the correct payment field to handle PayPal', () => {

    const paymentFieldName = 'baid';
    const userId = '123456';
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
      userId,
    );

    expect(paymentFields.baid).toEqual(expectedPaymentFields.baid);
    expect(paymentFields.userId).toEqual(undefined);
  });

  it('should create the correct payment field to handle Stripe', () => {

    const paymentFieldName = 'stripeToken';
    const userId = '123456';
    const token = 'PayPalToken';

    const expectedPaymentFields = {
      stripeToken: token,
      userId,
    };
    const paymentFields = getPaymentFields(
      token,
      undefined,
      undefined,
      undefined,
      paymentFieldName,
      userId,
    );

    expect(paymentFields.stripeToken).toEqual(expectedPaymentFields.stripeToken);
    expect(paymentFields.userId).toEqual(expectedPaymentFields.userId);
  });

  it('should return null if a unknown payment field name is passed', () => {

    const paymentFieldName = 'helloWorld';
    const userId = '123456';
    const token = 'PayPalToken';

    const expectedPaymentFields = {
      stripeToken: token,
      userId,
    };
    const paymentFields = getPaymentFields(
      token,
      undefined,
      undefined,
      undefined,
      paymentFieldName,
      userId,
    );

    expect(paymentFields).toEqual(null);
  });
});
