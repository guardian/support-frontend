import { postcodeIsWithinDeliveryArea } from 'components/subscriptionCheckouts/address/deliveryCheck';

describe('Delivery Check', () => {
  it('should return true if the postcode is in the delivery area', () => {
    expect(postcodeIsWithinDeliveryArea('SE2 2LB')).toBeTruthy();
    expect(postcodeIsWithinDeliveryArea('SE20 2LB')).toBeTruthy();
    expect(postcodeIsWithinDeliveryArea('SE8 2AD')).toBeTruthy();
    expect(postcodeIsWithinDeliveryArea('SW17 2LB')).toBeTruthy();
    expect(postcodeIsWithinDeliveryArea('Se 2LB')).toBeFalsy();
    expect(postcodeIsWithinDeliveryArea('should not work')).toBeFalsy();
    expect(postcodeIsWithinDeliveryArea('GE1 5JK')).toBeFalsy();
  });
});
