// @flow

// ----- Imports ----- //

import React from 'react';

import { Outset } from 'components/content/content';

import { Fieldset } from 'components/forms/fieldset';

import { type Option } from 'helpers/types/option';

import ProductPagePlanFormLabel from './productPagePlanFormLabel';
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

export type StatePropTypes<P> = {|
  plans: {[P]: Plan},
  selectedPlan: P | null,
|};

export type DispatchPropTypes<P> = {|
  onSubmitAction: () => *,
  setPlanAction: (P) => *,
|};

type PropTypes<P> = {|
  ...StatePropTypes<P>,
  ...DispatchPropTypes<P>,
|};


// ----- Render ----- //

export default function ProductPagePlanForm<P:string>({
  plans,
}: PropTypes<P>) {

  const keys = Object.keys(plans);

  return (
    <div
      className="component-product-page-plan-form"
    >
      <Outset>
        <div className="component-product-page-plan-form__items">
          {keys.map((key: P) => {
            const {
              copy, title, offer, price, saving, href, onClick,
            } = plans[key];
            return (
              <div className="component-product-page-plan-form__item">
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
              </div>
              );
            })}
        </div>
      </Outset>
    </div>
  );
}
