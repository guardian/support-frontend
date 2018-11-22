// @flow

// ----- Imports ----- //

import React from 'react';

import { outsetClassName, bgClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';

import ProductPageButton from '../productPageButton/productPageButton';
import ProductPagePlanFormLabel from './productPagePlanFormLabel';

import './productPagePlanForm.scss';

// ---- Types ----- //

export type Plan = {|
  title: string,
  copy: string,
  offer: string | null,
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
      <div className={outsetClassName}>
        <div className="component-product-page-plan-form__items">
          {keys.map((key: P) => {
            const {
              copy, title, offer,
            } = plans[key];
            return (
              <div className="component-product-page-plan-form__item">
                <ProductPagePlanFormLabel
                  title={title}
                  offer={offer}
                  type={key}
                  key={key}
                  checked={key === selectedPlan}
                  onChange={() => { setPlanAction(key); }}
                >
                  {copy}
                </ProductPagePlanFormLabel>
              </div>
              );
            })}
        </div>
      </div>
      <div className={['component-product-page-plan-form__cta', bgClassName].join(' ')} data-disabled={selectedPlan === null}>
        <ProductPageButton disabled={!selectedPlanTitle} type="submit">
          Subscribe now{selectedPlanTitle && ` – ${selectedPlanTitle}`}
        </ProductPageButton>
      </div>
    </form>
  );
}
