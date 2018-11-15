// @flow

// ----- Imports ----- //

import React from 'react';

import SvgInfo from 'components/svgs/information';
import { outsetClassName, bgClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';

import WeeklyCta from './weeklyCta';
import WeeklyFormLabel from './weeklyFormLabel';

import { type Action } from './productPagePeriodFormActions';

// ---- Types ----- //

type Period = {|
  title: string,
  copy: string,
  offer: string | null,
|}

type PropTypes = {|
  periods: {[string]: Period},
  selectedPeriod: string | null,
  onSubmit: (selectedPeriod: string | null) => void,
  setPeriodAction: (string) => Action,
|};

// ----- Render ----- //

export default function ProductPagePeriodForm({
  selectedPeriod, onSubmit, setPeriodAction, periods,
}: PropTypes) {
  return (
    <form
      className="weekly-form-wrap"
      onSubmit={(ev) => {
      ev.preventDefault();
      onSubmit(selectedPeriod);
    }}
    >
      <div className={outsetClassName}>
        <div className="weekly-form">
          {Object.keys(periods).map((key: string) => {
            const {
              copy, title, offer,
            } = periods[key];
            return (
              <div className="weekly-form__item">
                <WeeklyFormLabel
                  title={title}
                  offer={offer}
                  type={key}
                  key={key}
                  checked={key === selectedPeriod}
                  onChange={() => { setPeriodAction(key); }}
                >
                  {copy}
                </WeeklyFormLabel>
              </div>
              );
            })}
        </div>
      </div>
      <div className={['weekly-form__cta', bgClassName].join(' ')} data-disabled={selectedPeriod === null}>
        <WeeklyCta disabled={selectedPeriod === null} type="submit">
        Subscribe now{selectedPeriod && ` – ${periods[selectedPeriod].title}`}
        </WeeklyCta>
      </div>

      <div className="weekly-form__info">
        <SvgInfo />
      You can cancel your subscription at any time
      </div>
    </form>
  );
}
