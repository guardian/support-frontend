// @flow

import type { IsoCountry } from 'helpers/internationalisation/country';

export type AddressSearch = {
  Company: string,
  City: string,
  Line1: string,
  Line2: string,
  Province: string,
  PostalCode: string,
  CountryIso2: IsoCountry,
};

export type FindItemType = 'Address' | 'Postcode' | 'Locality';

// https://www.loqate.com/resources/support/apis/Capture/Interactive/Find/1.1/
export type FindItem = {
  Id: string,
  Type: FindItemType,
  Text: string,
  Highlight: string,
  Description: string,
}

export type FindResponse = {
  Items: FindItem[],
}

export type RetrieveResponse = {
  Items: AddressSearch[],
}

const post = (url: string, body: string) => {
  const bodyWithKey = `&Key=KU38-EK85-GN78-YA78&${body}`;
  return fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyWithKey,
    },
  )
    .then(response => response.json());
};

const find = (searchTerm: string): Promise<FindResponse> => post(
  'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws',
  `Text=${searchTerm}`,
);

const moreResults = (id: string): Promise<FindResponse> => post(
  'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws',
  `Container=${id}`,
);

const retrieve = (addressId: string): Promise<RetrieveResponse> => post(
  'https://services.postcodeanywhere.co.uk/Capture/Interactive/Retrieve/v1.10/json3.ws',
  `ID=${addressId}`,
);

export { find, moreResults, retrieve };
