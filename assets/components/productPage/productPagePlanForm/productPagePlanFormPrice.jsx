// @flow

// ----- Imports ----- //

import React from 'react';
import { type Option } from 'helpers/types/option';

import './productPagePlanFormLabel.scss';

// ---- Types ----- //

type PropTypes = {|
  title: Option<string>,
  copy: Option<string>,
|};


// ----- Render ----- //

export default ({
  title, copy,
}: PropTypes) => (

  (title || copy) &&
    <div className="component-product-page-plan-form-price">
      {title &&
        <strong className="component-product-page-plan-form-price__title">
          {title}
        </strong>
      }
      {copy &&
        <div className="component-product-page-plan-form-price__copy">
          {copy}
        </div>
      }
    </div>
);
