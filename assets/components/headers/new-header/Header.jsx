// @flow

// ----- Imports ----- //

import React from 'react';

import { countryGroups, type CountryGroup } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import SvgCheckmark from 'components/svgs/checkmark';
import SvgChevron from 'components/svgs/chevron';
import SvgGlobe from 'components/svgs/globe';
import SvgRoundel from 'components/svgs/roundel';

// ----- Types ----- //

type PropTypes = {
  selectedCountryGroup: ?CountryGroup,
};

// ----- Render ----- //

const renderCountryGroup = (selectedCountryGroup: CountryGroup) => (countryGroup: CountryGroup) => (
  <li className="countryGroups__item">
    <a href={`/${countryGroup.supportInternationalisationId}/contribute.new`}>
      {countryGroup === selectedCountryGroup ? (
        <span className="icon">
          <SvgCheckmark />
        </span>
      ) : null}
      {countryGroup.name} ({currencies[countryGroup.currency].extendedGlyph})
    </a>
  </li>
);

function NewHeader(props: PropTypes) {
  return (
    <header role="banner" className="gu-content__header">
      <a className="glogo" href="https://www.theguardian.com">
        <SvgRoundel />
      </a>
      { props.selectedCountryGroup ? (
        <details className="countryGroups">
          <summary aria-label={`Selected country: ${props.selectedCountryGroup.name} (${currencies[props.selectedCountryGroup.currency].glyph})`}>
            <SvgGlobe />
            <span className="countryGroups__label">{props.selectedCountryGroup.name} ({currencies[props.selectedCountryGroup.currency].extendedGlyph})</span>
            <span className="icon icon--arrows">
              <SvgChevron />
            </span>
          </summary>
          <ul className="countryGroups__list">
            {(Object.values(countryGroups): any).map(renderCountryGroup((props.selectedCountryGroup: any)))}
          </ul>
        </details>
      ) : null}
    </header>
  );
}

NewHeader.defaultProps = {
  selectedCountryGroup: null,
};

export { NewHeader };
