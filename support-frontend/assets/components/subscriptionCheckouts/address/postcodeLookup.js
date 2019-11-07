// @flow
import { postcodeLookupUrl } from 'helpers/routes';

export type PostcodeFinderResult = {|
  lineOne?: string,
  lineTwo?: string,
  city?: string,
|};

const getAddressesForPostcode = (postcode: string): Promise<PostcodeFinderResult[]> => {

  if (window.guardian.checkoutPostcodeLookup) {
    return fetch(postcodeLookupUrl(postcode))
      .then(res => res.json());
  }
  return Promise.resolve([]);

};

export { getAddressesForPostcode };
