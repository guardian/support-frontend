// @flow
import React from 'react';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { LandingPageCopyTestVariant } from 'helpers/abTests/abtestDefinitions';

const defaultHeaderCopy = 'Help\xa0us\xa0deliver\nthe\xa0independent\njournalism\xa0the\nworld\xa0needs';
const defaultContributeCopy = (
  <span>
    Make a recurring commitment to support The&nbsp;Guardian long-term or a single contribution
    as and when you feel like it – choose the option that suits you best.
  </span>);

const defaultHeaderCopyAndContributeCopy = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: defaultContributeCopy,
};

const helpVariantHeaderCopyAndContributeCopy = {
  headerCopy: defaultHeaderCopy,
  contributeCopy: (
    <span>
      The Guardian is editorially independent, meaning we set our own agenda. Our journalism is free from commercial
      bias and not influenced by billionaire owners, politicians or shareholders. No one edits our editor. No one
      steers our opinion. This is important as it enables us to give a voice to those less heard, challenge the
      powerful and hold them to account. It’s what makes us different to so many others in the media, at a time when
      factual, honest reporting is crucial.
      <span className="bold">Your support is critical for the future of Guardian journalism.</span>
    </span>
  ),
};

const defaultCountryGroupSpecificDetails = {
  GBPCountries: defaultHeaderCopyAndContributeCopy,
  EURCountries: defaultHeaderCopyAndContributeCopy,
  UnitedStates: defaultHeaderCopyAndContributeCopy,
  AUDCountries: {
    ...defaultHeaderCopyAndContributeCopy,
    headerCopy: 'Help us deliver the independent journalism Australia needs',
  },
  International: defaultHeaderCopyAndContributeCopy,
  NZDCountries: defaultHeaderCopyAndContributeCopy,
  Canada: defaultHeaderCopyAndContributeCopy,
};

const helpVariantCountryGroupSpecificDetails = {
  GBPCountries: helpVariantHeaderCopyAndContributeCopy,
  EURCountries: helpVariantHeaderCopyAndContributeCopy,
  UnitedStates: helpVariantHeaderCopyAndContributeCopy,
  AUDCountries: helpVariantHeaderCopyAndContributeCopy,
  International: helpVariantHeaderCopyAndContributeCopy,
  NZDCountries: helpVariantHeaderCopyAndContributeCopy,
  Canada: helpVariantHeaderCopyAndContributeCopy,
};

export type CountryMetaData = {
  headerCopy: string,
  contributeCopy?: React$Element<string>,
  headerClasses?: string,
  // URL to fetch ticker data from. null/undefined implies no ticker
  tickerJsonUrl?: string,
};

const countryGroupSpecificDetails: (variant: LandingPageCopyTestVariant) => {
  [CountryGroupId]: CountryMetaData
} = (variant: LandingPageCopyTestVariant) => {
  switch (variant) {
    case 'control':
    case 'notintest':
    default:
      return defaultCountryGroupSpecificDetails;
    case 'help':
      return helpVariantCountryGroupSpecificDetails;
  }
};

export { countryGroupSpecificDetails };
