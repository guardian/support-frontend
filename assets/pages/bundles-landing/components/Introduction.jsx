// @flow

// ----- Imports ----- //

import React from 'react';
import type { Contrib, Amounts, ContribError } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Campaign } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abtest';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
    abTests: Participations,
}

type HeaderCopy = {
    line1: string,
    line2: string,
}
// ----- Component ----- //

export default function Introduction(props: PropTypes) {

    const headerCopyOptions: {[variant: string] : HeaderCopy} = {
        control: {
            line1: `help us deliver the`,
            line2: `independent journalism the world&nbsp;needs`,
        },
        numberOfSupporters: {
            line1: `Over 800,000 readers now help fund the Guardian`,
            line2: `join them today and support the independent journalism the world needs
`
        }
    };
    q
    const headerCopy = props.abTests.headerCopyTest === 'numberOfSupporters' 
        ? headerCopyOptions['numberOfSupporters']
        : headerCopyOptions['control'];

  return (
    <section className="introduction-text">
      <div className="introduction-text__content gu-content-margin">
        <h1 className="introduction-text__heading">{headerCopy['line1']}</h1>
        <p>{headerCopy['line2']}</p>
        <h1 className="introduction-text__heading">support the Guardian</h1>
        <p>contribute or subscribe</p>
      </div>
    </section>
  );

}
