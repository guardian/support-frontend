import { getPaymentFields } from '../helpers/ajax';

jest.mock('ophan', () => {});

describe('Regular Contributions Payment fields', () => {

  it('should create the correct payment field to handle direct debit', () => {
    const sortCode = '200000';
    const accountNumber = '55779911';
    const accountHolderName = 'Bart Simpson';

    const expectedPaymentFields = {
      accountHolderName,
      sortCode,
      accountNumber,
    };
    const paymentFields = getPaymentFields({
      paymentMethod: 'DirectDebit',
      ...expectedPaymentFields,
    });

    expect(paymentFields.accountHolderName).toEqual(expectedPaymentFields.accountHolderName);
    expect(paymentFields.sortCode).toEqual(expectedPaymentFields.sortCode);
    expect(paymentFields.accountNumber).toEqual(expectedPaymentFields.accountNumber);
    expect(Object.keys(paymentFields).length).toEqual(3);
  });

  it('should create the correct payment field to handle PayPal', () => {
    const paymentFields = getPaymentFields({
      paymentMethod: 'PayPal',
      token: 'PayPalToken',
    });

    expect(paymentFields.baid).toEqual('PayPalToken');
    expect(paymentFields.userId).toEqual(undefined);
    expect(Object.keys(paymentFields).length).toEqual(1);
  });

  it('should create the correct payment field to handle Stripe', () => {
    const paymentFields = getPaymentFields({
      paymentMethod: 'Stripe',
      token: 'StripeToken',
    });

    expect(paymentFields.stripeToken).toEqual('StripeToken');
    expect(Object.keys(paymentFields).length).toEqual(1);
  });

  it('should return null if a unknown payment field name is passed', () => {
    const paymentFields = getPaymentFields({
      paymentMethod: 'Not allowed',
      token: 'PayPalToken',
    });

    expect(paymentFields).toEqual(null);
  });
});
