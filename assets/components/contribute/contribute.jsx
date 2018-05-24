// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import type { Node } from 'react';
import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //
type PropTypes = {
  copy: string | Node,
  children: Node,
  desktopAboveTheFoldVariant?: ?('control' | 'variant' | 'notintest'),
};

// ----- Component ----- //

export default function Contribute(props: PropTypes) {
  let modifiers = [];
  let heading = 'Contribute';

  if (props.desktopAboveTheFoldVariant) {
    if (props.desktopAboveTheFoldVariant === 'variant') {
      modifiers = ['variant'];
      heading = '';
    }
  }

  return (
    <div className={classNameWithModifiers('component-contribute', modifiers)}>
      <PageSection
        modifierClass="contribute"
        heading={heading}
        headingChildren={<Secure modifierClass="contribute-header" />}
      >
        <Secure modifierClass="contribute-body" />
        <p className={classNameWithModifiers('component-contribute__description', modifiers)}>{props.copy}</p>
        {props.children}
      </PageSection>
    </div>
  );

}

Contribute.defaultProps = {
  desktopAboveTheFoldVariant: null,
};
