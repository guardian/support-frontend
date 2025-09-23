# Internationalisation Helper Functions

The internationalisation helper functions uses three main types:

- CountryGroup
- Country
- Currency
  The base types are defined in the [`internationalisation`](https://github.com/guardian/support-service-lambdas/tree/main/modules/internationalisation) module in support-service-lambdas.

## Country Group

The `CountryGroup` defines a grouping of countries with a single currency.
This is used throughout the site to provide region specific versions of pages such as the three tier landing page or the checkout.

`CountryGroup` is defined as follows:

```
type CountryGroupId = 'GBPCountries' | 'UnitedStates' | AUDCountries | EURCountries | International;

type CountryGroup = {
  name: string,
  currency: IsoCurrency,
  countries: IsoCountry[],
  supportRegionId: SupportRegionId,
};
```

- **name**: Business name for a certain group of countries.
- **currency**: The currency shared by all the countries of a certain group.
- **countries**: The countries which shape a group.
- **supportRegionId**: The id of the support region that matches with this group.

## Country

We map all the countries using `alpha-2` standard.

## Currency

We map all the currencies using `ISO 4217` standard.
