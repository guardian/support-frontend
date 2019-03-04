// @flow
import { postcodeLookupUrl } from 'helpers/routes';

export type Address = {|
  lineOne?: string,
  lineTwo?: string,
  city?: string,
|};

const getAddressesForPostcode = (postcode: string): Promise<Address[]> =>
  fetch(postcodeLookupUrl(postcode))
    .then(res => res.json());

export { getAddressesForPostcode };
