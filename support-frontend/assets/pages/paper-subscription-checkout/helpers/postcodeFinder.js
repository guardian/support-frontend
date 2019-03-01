// @flow

export type Address = {|
  lineOne?: string,
  lineTwo?: string,
  city?: string,
|};

const getAddressesForPostcode = (postcode: string): Promise<Address[]> =>
  fetch(`/postcode-lookup/${postcode}`)
    .then(res => res.json());

export { getAddressesForPostcode };
