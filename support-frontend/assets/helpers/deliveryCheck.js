// @flow

import { getGlobal } from 'helpers/globals';

const M25_POSTCODE_PREFIXES = getGlobal('homeDeliveryPostcodes') || [];

export const postcodeHasPrefix = (postcode: string, expectedPrefix: string): boolean => {

  const formattedPostcode = postcode.replace(' ', '').toUpperCase();
  const actualPrefix = formattedPostcode.slice(0, -3);

  return actualPrefix === expectedPrefix;
};

const postcodeIsWithinDeliveryArea = (postcode: string): boolean =>
  M25_POSTCODE_PREFIXES.filter(prefix => postcodeHasPrefix(postcode, prefix)).length > 0;

export {
  postcodeIsWithinDeliveryArea,
};

