// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';
import { type Option } from 'helpers/types/option';

import uuidv4 from 'uuid';

import './productPagePlanFormLabel.scss';

// ---- Types ----- //

type PropTypes = {|
  type: string,
  title: string,
  offer: Option<string>,
  footer: Option<Node>,
  children: Node,
  checked: boolean,
  onChange: (Event) => void,
|};


// ----- Render ----- //

export default ({
  type, title, offer, children, checked, onChange, footer,
}: PropTypes) => {
  const id = uuidv4();
  return (
    <label onChange={onChange} htmlFor={id} className="component-product-page-plan-form-label">
      <input checked={checked} className="component-product-page-plan-form-label__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="component-product-page-plan-form-label__box">
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
      </div>
    </label>
  );
};
