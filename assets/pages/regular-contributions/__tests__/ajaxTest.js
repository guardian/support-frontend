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
});
