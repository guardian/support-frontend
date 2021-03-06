// @flow

// ----- Imports ----- //
// $FlowIgnore
import React, { useState, useRef } from 'react';

import SvgDropdownArrow from 'components/svgs/dropdownArrow';
import Dialog from 'components/dialog/dialog';
import Menu, { LinkItem } from 'components/menu/menu';

import { type Option } from 'helpers/types/option';
import { sendTrackingEventsOnClick, type SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import {
  countryGroups,
  type CountryGroupId,
} from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import './countryGroupSwitcher.scss';
import styles from './countryGroupSwitcher.module.scss';

// ----- Props ----- //

export type PropTypes = {|
  countryGroupIds: CountryGroupId[],
  selectedCountryGroup: CountryGroupId,
  trackProduct?: Option<SubscriptionProduct>,
  subPath: string,
|};

// ----- Component ----- //

function CountryGroupSwitcher({
  subPath, selectedCountryGroup, countryGroupIds, trackProduct,
}: PropTypes) {
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bounds, setBounds] = useState({ top: 0, left: 0 });

  function onCountryGroupSelect(cgId: CountryGroupId): void {
    sendTrackingEventsOnClick({
      id: `toggle_country_${cgId}`,
      ...(trackProduct ? { product: trackProduct } : {}),
      componentType: 'ACQUISITIONS_OTHER',
    })();
  }

  return (
    <div className="component-country-group-switcher">
      <button
        aria-label="Select a country"
        className={styles.button}
        ref={buttonRef}
        onClick={() => {
          if (buttonRef.current) {
            setBounds(buttonRef.current.getBoundingClientRect());
          }
          setMenuOpen(true);
          }}
      >
        {countryGroups[selectedCountryGroup].name}
        {' '}
        <strong>{currencies[countryGroups[selectedCountryGroup].currency].extendedGlyph}</strong>
        <SvgDropdownArrow />
      </button>
      <Dialog
        aria-label="Select a country"
        open={menuOpen}
        blocking={false}
        styled={false}
        onStatusChange={(status) => {
          setMenuOpen(status);
          if (status) {
            sendTrackingEventsOnClick({
              id: 'toggle_country',
              componentType: 'ACQUISITIONS_BUTTON',
            })();
          }
        }}
      >
        <Menu style={{ top: bounds.top, left: bounds.left, position: 'absolute' }}>
          {
            countryGroupIds.map((countryGroupId: CountryGroupId) =>
            (
              <LinkItem
                href={`/${countryGroups[countryGroupId].supportInternationalisationId}${subPath}`}
                onClick={() => onCountryGroupSelect(countryGroupId)}
                isSelected={countryGroupId === selectedCountryGroup}
              >
                {countryGroups[countryGroupId].name}
                {' '}
                {currencies[countryGroups[countryGroupId].currency].extendedGlyph}
              </LinkItem>
              ))
          }
          <button
            className="visually-hidden"
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            Close
          </button>
        </Menu>
      </Dialog>
    </div>
  );
}

CountryGroupSwitcher.defaultProps = {
  trackProduct: null,
};

// ----- Exports ----- //

export default CountryGroupSwitcher;
