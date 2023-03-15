# Internationalisation Helper

The internationalisation helper is formed by:

- CountryGroup
- Country
- Currency

These three values are stored in the common state.

## Country Group

The `CountryGroup` is the data structure which is defined to apply business requirements to the country and currency.
We would like to group countries according different requirements and assign to all the countries of that group the
same currency. Additionally, this structure should match the `CountryGroup` case class defined in
[`support-internationalisation`](https://github.com/guardian/support-internationalisation) project.

For example the decision of having a landing page for a certain country or group of country should be modeled using
country groups.

`CountryGroup` is defined as follows:

```
type CountryGroupId = 'GBPCountries' | 'UnitedStates' | AUDCountries | EURCountries | International;

type CountryGroup = {
  name: string,
  currency: IsoCurrency,
  countries: IsoCountry[],
  supportInternationalizationId: string,
};
```

- **name**: Business name for a certain group of countries.
- **currency**: The currency shared by all the countries of a certain group.
- **countries**: The countries which shape a group.
- **supportInternationalizationId**: The id of support-internationalization that match with this group.

## Country

We map all the countries using `alpha-2` standard.

## Currency

We map all the currencies using `ISO 4217` standard.
