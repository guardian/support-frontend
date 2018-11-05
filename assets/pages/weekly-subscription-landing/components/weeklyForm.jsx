// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import uuidv4 from 'uuid';
import { classNameWithModifiers } from 'helpers/utilities';

import WeeklyCta from './weeklyCta';

// ---- Types ----- //

type LabelPropTypes = {|
  type: string,
  title: string,
  offer?: ?string,
  children: Node,
  checked: boolean,
|};


// ----- Render ----- //

const FormLabel = ({
  type, title, offer, children, checked,
}: LabelPropTypes) => {
  const id = uuidv4();
  return (
    <label className={classNameWithModifiers('weekly-form-label', [checked ? 'checked' : null])} htmlFor={id}>
      <input className="weekly-form-label__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="weekly-form-label__title">{title}</div>
      {offer && <div className="weekly-form-label__offer">{offer}</div>}
      <div className="weekly-form-label__copy">{children}</div>
    </label>
  );
};

FormLabel.defaultProps = {
  offer: null,
  checked: false,
};

const WeeklyForm = () => (
  <form className="weekly-form-wrap">
    <div className="weekly-form">
      <div className="weekly-form__item">
        <FormLabel title="6 for £6" offer="Introductory offer" type="weekly">
        6 issues for 6 pounds and then £37 every 3 months
        </FormLabel>
      </div>
      <div className="weekly-form__item">
        <FormLabel title="Quarterly" type="quarterly">
        6 issues for 6 pounds and then £37 every 3 months
        </FormLabel>
      </div>
      <div className="weekly-form__item">
        <FormLabel title="Annually" offer="10% off" type="annually">
        6 issues for 6 pounds and then £37 every 3 months
        </FormLabel>
      </div>
    </div>

    <WeeklyCta type="submit">Subscribe now</WeeklyCta>
  </form>
);

export default WeeklyForm;
