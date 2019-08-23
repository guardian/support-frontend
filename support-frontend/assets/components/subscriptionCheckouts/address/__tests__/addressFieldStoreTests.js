import { isHomeDeliveryInM25 } from 'components/subscriptionCheckouts/address/addressFieldsStore';

jest.mock('ophan', () => {});

describe('addressFieldStore', () => {

  describe('isHomeDeliveryInM25 ', () => {
    // - this is a "form error" check so when this function returns "false" there is an error
    it('should return true when the order is a home delivery and the postcode in the M25', () => {
      const fulfilmentOption = 'HomeDelivery';
      const postcode = 'SE23 2AB';

      const result = isHomeDeliveryInM25(fulfilmentOption, postcode);

      expect(result).toBeTruthy();
    });

    it('should return false when the order is a home delivery and the postcode is outside the M25', () => {
      const fulfilmentOption = 'HomeDelivery';
      const postcode = 'DA11 7NP';

      const result = isHomeDeliveryInM25(fulfilmentOption, postcode);

      expect(result).toBeFalsy();
    });

    it('should return true when the fulfilment option is not home delivery', () => {
      // this error is not applicable if the fulfilment option is not home delivery
      const fulfilmentOption = 'Collection';
      const postcode = 'DA11 7NP';

      const result = isHomeDeliveryInM25(fulfilmentOption, postcode);

      expect(result).toBeTruthy();
    });
  });

});
