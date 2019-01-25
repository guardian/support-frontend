// @flow

// ----- Imports ----- //

import React from 'react';

import { bgClassName, Outset } from 'components/productPage/productPageContentBlock/productPageContentBlock';
import Button from 'components/button/button';

import { type Option } from 'helpers/types/option';

import ProductPagePlanFormLabel from './productPagePlanFormLabel';
import ProductPagePlanFormPrice from './productPagePlanFormPrice';

import './productPagePlanForm.scss';

// ---- Types ----- //

export type Plan = {|
  title: string,
  copy: string,
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
  plans, selectedPlan, onSubmitAction, setPlanAction,
}: PropTypes<P>) {

  const keys = Object.keys(plans);
  const selectedPlanTitle = selectedPlan && plans[selectedPlan] ? plans[selectedPlan].title : null;

  return (
    <form
      className="component-product-page-plan-form"
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmitAction();
      }}
    >
      <Outset>
        <div className="component-product-page-plan-form__items">
          {keys.map((key: P) => {
            const {
              copy, title, offer, price, saving,
            } = plans[key];
            return (
              <div className="component-product-page-plan-form__item">
                <ProductPagePlanFormLabel
                  {...{
                  title, offer, key,
                  }}
                  footer={((price || saving) ?
                    <ProductPagePlanFormPrice title={price} copy={saving} />
                    : null
                  )}
                  type={key}
                  checked={key === selectedPlan}
                  onChange={() => { setPlanAction(key); }}
                >
                  {copy}
                </ProductPagePlanFormLabel>
              </div>
              );
            })}
        </div>
      </Outset>
      <div className={['component-product-page-plan-form__cta', bgClassName].join(' ')} data-disabled={selectedPlan === null}>
        <Button aria-label={null} disabled={!selectedPlanTitle} type="submit">
          {['Subscribe now', ...(selectedPlanTitle ? [selectedPlanTitle] : [])].join(' - ')}
        </Button>
      </div>
    </form>
  );
}
