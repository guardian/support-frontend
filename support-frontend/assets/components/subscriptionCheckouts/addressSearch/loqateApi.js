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

export type FindItem = {
  Id: string,
  Text: string,
}

export type FindResponse = {
  Items: FindItem[],
}

const find = (searchTerm: string): Promise<FindResponse> => {
  const body = `&Key=KU38-EK85-GN78-YA78&Text=${searchTerm}`;

  return fetch(
    'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  )
    .then(response => response.json());
};

export { find };
