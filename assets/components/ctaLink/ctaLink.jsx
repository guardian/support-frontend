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
  trackComponentEvent?: Function,
  onClick?: ?Function,
  tabIndex?: number,
  id?: ?string,
  svg?: Node,
  dataLinkName?: ?string,
};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {

  const accessibilityHintId = props.id ? `accessibility-hint-${props.id}` : uuidv4();
  const ctaUniqueClassName = `component-cta-link ${props.ctaId}`;

  return (
    <a
      id={props.id}
      className={ctaUniqueClassName}
      href={props.url}
      onClick={
        () => {
          if (typeof props.trackComponentEvent === 'function') {
            props.trackComponentEvent('CLICK', props.ctaId);
          }
          if (typeof props.onClick === 'function') {
            props.onClick();
          }
        }
      }
      onKeyPress={props.onClick ? clickSubstituteKeyPressHandler(props.onClick) : null}
      tabIndex={props.tabIndex}
      data-link-name={props.dataLinkName}
      aria-describedby={accessibilityHintId}
    >
      <span>{props.text}</span>
      {props.svg}
      <p id={accessibilityHintId} className="accessibility-hint">{props.accessibilityHint}</p>
    </a>
  );

}


// ----- Default Props ----- //

CtaLink.defaultProps = {
  url: null,
  trackComponentEvent: () => {},
  onClick: null,
  tabIndex: 0,
  id: null,
  dataLinkName: null,
  svg: <SvgArrowRightStraight />,
};
