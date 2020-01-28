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
