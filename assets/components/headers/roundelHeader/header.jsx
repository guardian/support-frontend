// @flow

// ----- Imports ----- //

import React from 'react';

import { countryGroups, type CountryGroup } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import SvgCheckmark from 'components/svgs/checkmark';
import SvgChevron from 'components/svgs/chevron';
import SvgGlobe from 'components/svgs/globe';
import SvgRoundel from 'components/svgs/roundel';
import SvgGuardianLogo from 'components/svgs/guardianLogo';

// ----- Types ----- //

type PropTypes = {|
  selectedCountryGroup: ?CountryGroup,
  longLogo: boolean
|};

// ----- Render ----- //

const renderCountryGroup = (selectedCountryGroup: CountryGroup) => (countryGroup: CountryGroup) => (
  <li className="countryGroups__item">
    <a href={`/${countryGroup.supportInternationalisationId}/contribute`}>
      {countryGroup.name} ({currencies[countryGroup.currency].extendedGlyph})
      {countryGroup === selectedCountryGroup ? (
        <span className="icon">
          <SvgCheckmark />
        </span>
      ) : null}
    </a>
  </li>
);

function RoundelHeader(props: PropTypes) {
  return (
    <header role="banner" className="gu-content__header">
      { props.longLogo ? (
        <a className="guardian-logo" href="https://www.theguardian.com">
          <SvgGuardianLogo />
        </a>
      ) : (
        <a className="glogo" href="https://www.theguardian.com">
          <SvgRoundel />
        </a>
      )}
      { props.selectedCountryGroup ? (
        <details className="countryGroups">
          <summary aria-label={`Selected country: ${props.selectedCountryGroup.name} (${currencies[props.selectedCountryGroup.currency].glyph})`}>
            {/* Safari doesn't respect styles applied to <summary> so we need this wrapper div */}
            <div className="countryGroups__summary-wrapper">
              <SvgGlobe />
              <span className="countryGroups__label">{props.selectedCountryGroup.name} ({currencies[props.selectedCountryGroup.currency].extendedGlyph})</span>
              <span className="icon icon--arrows">
                <SvgChevron />
              </span>
            </div>
          </summary>
          <ul className="countryGroups__list">
            {(Object.values(countryGroups): any).map(renderCountryGroup((props.selectedCountryGroup: any)))}
          </ul>
        </details>
      ) : null}
    </header>
  );
}

RoundelHeader.defaultProps = {
  selectedCountryGroup: null,
};

export { RoundelHeader };
