// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import { classNameWithModifiers } from 'helpers/utilities';

import type { Node } from 'react';

// ----- Types ----- //
type PropTypes = {
  copy: string | Node,
  children: Node,
  heading?: string,
  modifiers?: Array<?string>,
};

// ----- Component ----- //

export default function Contribute(props: PropTypes) {
  const modifiers = props.modifiers || [];
  const secureHeadingModifiers = modifiers.slice(0);
  const secureBodyModifiers = modifiers.slice(0);

  secureHeadingModifiers.push('contribute-header');
  secureBodyModifiers.push('contribute-body');

  return (
    <div className="component-contribute">
      <PageSection
        modifierClass="contribute"
        heading={props.heading}
        headingChildren={<Secure modifiers={secureHeadingModifiers} />}
      >
        <Secure modifiers={secureBodyModifiers} />
        <p className={classNameWithModifiers('component-contribute__description', modifiers)}>{props.copy}</p>
        {props.children}
      </PageSection>
    </div>
  );

}

Contribute.defaultProps = {
  heading: '',
  modifiers: [],
};
