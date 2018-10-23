// @flow

// ----- Imports ----- //

import React from 'react';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';
import uuidv4 from 'uuid';
import { classNameWithModifiers } from 'helpers/utilities';

import type { Node } from 'react';


// ----- Types ----- //

type PropTypes = {|
  text: string,
  accessibilityHint: string,
  url?: ?string,
  onClick?: ?Function,
  tabIndex?: number,
  id?: ?string,
  svg?: Node,
  modifierClasses: Array<?string>,
|};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {

  const accessibilityHintId = props.id ? `accessibility-hint-${props.id}` : uuidv4();

  return (
    <a
      id={props.id}
      className={classNameWithModifiers('component-cta-link', props.modifierClasses)}
      href={props.url}
      onClick={props.onClick}
      onKeyPress={props.onClick ? clickSubstituteKeyPressHandler(props.onClick) : null}
      tabIndex={props.tabIndex}
      aria-describedby={accessibilityHintId}
    >
      <span className="component-cta-link__text">{props.text}</span>
      {props.svg}
      <p id={accessibilityHintId} className="accessibility-hint">{props.accessibilityHint}</p>
    </a>
  );

}


// ----- Default Props ----- //

CtaLink.defaultProps = {
  url: null,
  onClick: null,
  tabIndex: 0,
  id: null,
  svg: <SvgArrowRightStraight />,
  modifierClasses: [],
};
