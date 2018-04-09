// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgArrowRightStraight } from 'components/svg/svg';
import { clickSubstituteKeyPressHandler } from 'helpers/utilities';
import uuidv4 from 'uuid';
import { addQueryParamToURL } from 'helpers/url';
import { classNameWithOptModifier } from 'helpers/utilities';

import type { Node } from 'react';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';


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
  acquisitionData?: ?ReferrerAcquisitionData,
};

// ----- Component ----- //

export default function CtaLink(props: PropTypes) {

  const accessibilityHintId = props.id ? `accessibility-hint-${props.id}` : uuidv4();
  const urlString = props.url || '';

  return (
    <a
      id={props.id}
      className={classNameWithOptModifier('component-cta-link', props.ctaId)}
      href={props.acquisitionData ?
        addQueryParamToURL(urlString, 'acquisitionData', JSON.stringify(props.acquisitionData))
         : props.url
      }
      onClick={
        (clickEvent) => {
          if (props.trackComponentEvent) {
            props.trackComponentEvent('CLICK', props.ctaId);
          }
          if (props.onClick) {
            props.onClick(clickEvent);
          }
        }
      }
      onKeyPress={props.onClick ? clickSubstituteKeyPressHandler(props.onClick) : null}
      tabIndex={props.tabIndex}
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
  svg: <SvgArrowRightStraight />,
  acquisitionData: null,
};
