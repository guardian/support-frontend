// @flow

// ----- Imports ----- //

import React from 'react';

import { type Option } from 'helpers/types/option';

import ProductPagePlanFormLabelDark from './darkBackground/productPagePlanFormLabelDark';
import ProductPagePlanFormLabel from './lightBackground/productPagePlanFormLabel';
import ProductPagePlanFormPrice from './productPagePlanFormPrice';

import './productPagePlanForm.scss';

// ---- Types ----- //

export type Plan = {|
  title: string,
  copy: string,
  href: string,
  onClick?: Option<() => void>,
  offer: Option<string>,
  price: Option<string>,
  saving: Option<string>,
|}

export type PropTypes<P> = {|
  plans: {[P]: Plan},
  theme: 'light' | 'dark',
|};

// ----- Render ----- //

export default function ProductPagePlanForm<P:string>({
  plans, theme,
}: PropTypes<P>) {

  const keys = Object.keys(plans);

  return (
    <div
      className="component-product-page-plan-form"
    >
      <div className={`component-product-page-plan-form__items--${theme}`}>
        {keys.map((key: P) => {
            const {
              copy, title, offer, price, saving, href, onClick,
            } = plans[key];
            return (
              <div className={`component-product-page-plan-form__item--${theme}`}>
                {theme === 'light' && (
                  <ProductPagePlanFormLabel
                    {...{
                    title, offer, key, href, onClick,
                    }}
                    footer={((price || saving) ?
                      <ProductPagePlanFormPrice title={price} copy={saving} />
                      : null
                    )}
                  >
                    {copy}
                  </ProductPagePlanFormLabel>
                )}
                {theme === 'dark' && (
                  <ProductPagePlanFormLabelDark
                    {...{
                    title, offer, key, href, onClick,
                    }}
                    footer={((price || saving) ?
                      <ProductPagePlanFormPrice title={price} copy={saving} />
                      : null
                    )}
                  >
                    {copy}
                  </ProductPagePlanFormLabelDark>
                )}
              </div>
              );
            })}
      </div>
    </div>
  );
}
