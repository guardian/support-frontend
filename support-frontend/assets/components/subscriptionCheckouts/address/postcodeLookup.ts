import { postcodeLookupUrl } from "helpers/urls/routes";
import { getGlobal } from "helpers/globalsAndSwitches/globals";
export type PostcodeFinderResult = {
  lineOne?: string;
  lineTwo?: string;
  city?: string;
};

function handleErrors(response: Response) {
  if (response.ok) {
    return response;
  }

  if (response.status === 500) {
    throw new Error('External address service temporarily unavailable. Please proceed with checkout. We apologise for the inconvenience');
  } else if (response.status === 400) {
    throw new Error('We couldn\'t find this postcode, please check and try again or enter your address below.');
  } else {
    throw new Error(`Error while contacting address API: ${response.statusText}`);
  }
}

const getAddressesForPostcode = (postcode: string): Promise<PostcodeFinderResult[]> => {
  const postcodeLookup = getGlobal('checkoutPostcodeLookup');

  if (postcodeLookup) {
    return fetch(postcodeLookupUrl(postcode)).then(handleErrors).then(res => res.json());
  }

  return Promise.resolve([]);
};

export { getAddressesForPostcode };