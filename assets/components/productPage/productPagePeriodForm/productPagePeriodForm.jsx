// @flow

// ----- Imports ----- //

import React from 'react';

import SvgInfo from 'components/svgs/information';
import { outsetClassName, bgClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';

import ProductPageButton from '../productPageButton/productPageButton';
import ProductPagePeriodFormLabel from './productPagePeriodFormLabel';

import { type Action } from './productPagePeriodFormActions';

// ---- Types ----- //

type Period = {|
  title: string,
  copy: string,
  offer: string | null,
|}

type PropTypes<P> = {|
  periods: {[P]: Period},
  selectedPeriod: P | null,
  onSubmit: (selectedPeriod: string | null) => void,
  setPeriodAction: (P) => Action<P>,
|};


// ----- Render ----- //

export default function ProductPagePeriodForm<P:string>({
  selectedPeriod, onSubmit, setPeriodAction, periods,
}: PropTypes<P>) {
  return (
    <form
      className="component-product-page-period-form-wrap"
      onSubmit={(ev) => {
      ev.preventDefault();
      onSubmit(selectedPeriod);
    }}
    >
      <div className={outsetClassName}>
        <div className="component-product-page-period-form">
          {Object.keys(periods).map((key: P) => {
            const {
              copy, title, offer,
            } = periods[key];
            return (
              <div className="component-product-page-period-form__item">
                <ProductPagePeriodFormLabel
                  title={title}
                  offer={offer}
                  type={key}
                  key={key}
                  checked={key === selectedPeriod}
                  onChange={() => { setPeriodAction(key); }}
                >
                  {copy}
                </ProductPagePeriodFormLabel>
              </div>
              );
            })}
        </div>
      </div>
      <div className={['component-product-page-period-form__cta', bgClassName].join(' ')} data-disabled={selectedPeriod === null}>
        <ProductPageButton disabled={selectedPeriod === null} type="submit">
        Subscribe now{selectedPeriod && ` – ${periods[selectedPeriod].title}`}
        </ProductPageButton>
      </div>

      <div className="component-product-page-period-form__info">
        <SvgInfo />
      You can cancel your subscription at any time
      </div>
    </form>
  );
}
