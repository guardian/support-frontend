// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';
import { type Option } from 'helpers/types/option';
import AnchorButton from 'components/button/anchorButton';

import './productPagePlanFormLabel.scss';

// ---- Types ----- //

type PropTypes = {|
  title: string,
  offer: Option<string>,
  footer: Option<Node>,
  onClick: Option<() => void>,
  children: Node,
  href: string,
|};


// ----- Render ----- //

export default ({
  title, offer, children, onClick, footer, href,
}: PropTypes) => (
  <div className="component-product-page-plan-form-label">
    <div className="component-product-page-plan-form-label__box" aria-hidden="true">
      <div className="component-product-page-plan-form-label__title">
        {title}
        <div aria-hidden="true" className="component-product-page-plan-form-label__check"><SvgCheckmark /></div>
      </div>
      <div className="component-product-page-plan-form-label__content">
        {offer &&
        <strong className="component-product-page-plan-form-label-offer">
          <span className="component-product-page-plan-form-label-offer__inside">{offer}</span>
        </strong>
          }
        <div className="component-product-page-plan-form-label__children">{children}</div>
      </div>
      {footer &&
      <div className="component-product-page-plan-form-label__footer">
        {footer}
      </div>
        }
      <div className="component-product-page-plan-form-label__cta" >
        <AnchorButton id={`qa-${title.toLowerCase().replace(' ', '-')}`} onClick={onClick} aria-label={`Subscribe – ${title}`} href={href}>
          Subscribe now
        </AnchorButton>
      </div>
    </div>
  </div>
);
