import { postcodeIsWithinDeliveryArea, postcodeHasPrefix } from 'components/subscriptionCheckouts/address/deliveryCheck';

describe('Delivery Check', () => {

  describe('postcodeIsWithinDeliveryArea', () => {
    it('should return true if the postcode is in the delivery area', () => {
      expect(postcodeIsWithinDeliveryArea('SE2 2LB')).toBeTruthy();
      expect(postcodeIsWithinDeliveryArea('SE20 2LB')).toBeTruthy();
      expect(postcodeIsWithinDeliveryArea('SE8 2AD')).toBeTruthy();
      expect(postcodeIsWithinDeliveryArea('SW17 2LB')).toBeTruthy();
      expect(postcodeIsWithinDeliveryArea('SE19 2HL')).toBeTruthy();
    });

    it('should return false if postcode is outside delivery area', () => {
      expect(postcodeIsWithinDeliveryArea('DA11 2HL')).toBeFalsy();
      expect(postcodeIsWithinDeliveryArea('DA12 2HL')).toBeFalsy();
    });

    it('should false if input is not a valid postcode prefix', () => {
      expect(postcodeIsWithinDeliveryArea('Se 2LB')).toBeFalsy();
      expect(postcodeIsWithinDeliveryArea('should not work')).toBeFalsy();
      expect(postcodeIsWithinDeliveryArea('GE1 5JK')).toBeFalsy();
    });

    it('should false is input is null', () => {
      expect(postcodeIsWithinDeliveryArea(null)).toBeFalsy();
    });
  });

  describe('postcodeHasPrefix', () => {
    it('should return true if the postcode prefix matches the prefix', () => {
      const postcode = 'SE23 2AB';
      const prefix = 'SE23';

      expect(postcodeHasPrefix(postcode, prefix)).toBeTruthy();
    });
  });
});
