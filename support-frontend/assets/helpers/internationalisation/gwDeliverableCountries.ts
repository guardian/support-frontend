import type { IsoCountry } from './country';
import { gwCountries } from "./gwCountries";

const gwNonDeliverableCountries: Set<IsoCountry> = new Set([
  'AF', // Afghanistan
  'KI', // Kiribati
  'LY', // Libya
  'MD', // Moldova
  'NR', // Nauru
  'SD', // Sudan
  'SS', // South Sudan
  'SO', // Somalia
  'SY', // Syria
  'UA', // Ukraine
  'YE', // Yemen
]);

const gwDeliverableCountries: Partial<Record<IsoCountry, string>> = Object.fromEntries(
  (Object.entries(gwCountries) as Array<[IsoCountry, string]>).filter(
    ([countryCode]) => !gwNonDeliverableCountries.has(countryCode)
  )
);

export { gwDeliverableCountries };
