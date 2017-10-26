// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgArrowRightStraight } from 'components/svg/svg';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';
import uuidv4 from 'uuid';

import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {
  text: string,
  accessibilityHint: string,
  ctaId: string,
  url?: ?string,
  onClick?: ?Function,
  tabIndex?: number,
  id?: ?string,
  svg?: Node,
};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {

  const accessibilityHintId = props.id ? `accessibility-hint-${props.id}` : uuidv4();
  const ctaUniqueClassName = `component-cta-link ${props.ctaId}`;

  return (
    <div>
      <a
        id={props.id}
        className={ctaUniqueClassName}
        href={props.url}
        onClick={props.onClick}
        onKeyPress={props.onClick ? clickSubstituteKeyPressHandler(props.onClick) : null}
        tabIndex={props.tabIndex}
        aria-describedby={accessibilityHintId}
      >
        <span>{props.text}</span>
        {props.svg}
      </a>
      <p id={accessibilityHintId} className="accessibility-hint">{props.accessibilityHint}</p>
    </div>
  );

}


// ----- Default Props ----- //

CtaLink.defaultProps = {
  url: null,
  onClick: null,
  tabIndex: 0,
  id: null,
  svg: <SvgArrowRightStraight />,
};
