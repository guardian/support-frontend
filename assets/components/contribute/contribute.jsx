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
  modifierClasses: Array<?string>,
};


// ----- Component ----- //

export default function Contributes(props: PropTypes) {
  const secureHeadingModifiers = props.modifierClasses.slice(0);
  const secureBodyModifiers = props.modifierClasses.slice(0);

  secureHeadingModifiers.push('contribute-header');
  secureBodyModifiers.push('contribute-body');

  return (
    <div className="component-contribute">
      <PageSection
        modifierClass="contribute"
        heading={props.heading}
        headingChildren={<Secure modifierClasses={secureHeadingModifiers} />}
      >
        <Secure modifierClasses={secureBodyModifiers} />
        <p className={classNameWithModifiers('component-contribute__description', props.modifierClasses)}>
          {props.copy}
        </p>
        {props.children}
      </PageSection>
    </div>
  );

}


// ----- Default Props ----- //

Contributes.defaultProps = {
  heading: '',
  modifierClasses: [],
};
