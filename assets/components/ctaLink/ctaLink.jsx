// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';
import { clickSubstituteKeyPressHandler, UUID } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  text: string,
  accessibilityHint: string,
  ctaId: string,
  url?: ?string,
  onClick?: ?Function,
  tabIndex?: number,
  id?: ?string,
};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {
  const accessibilityHintId = props.id ? `accessibility-hint-${props.id}` : UUID();
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
        <Svg svgName="arrow-right-straight" />
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
};
