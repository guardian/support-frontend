// @flow
import { postcodeLookupUrl } from 'helpers/routes';

export type PostcodeFinderResult = {|
  lineOne?: string,
  lineTwo?: string,
  city?: string,
|};

const getAddressesForPostcode = (postcode: string): Promise<PostcodeFinderResult[]> =>
  fetch(postcodeLookupUrl(postcode))
    .then(res => res.json());

export { getAddressesForPostcode };
