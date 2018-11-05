// @flow

// ----- Imports ----- //

import React from 'react';

import uuidv4 from 'uuid';

import WeeklyCtaButton from './weeklyCtaButton';

// ----- Render ----- //

const FormLabel = ({ type }: {type: string}) => {
  const id = uuidv4();
  return (<label htmlFor={id}><input id={id} type="radio" name="sub-type" value={type} />{type}</label>);
};

const WeeklyForm = () => (
  <form>
    <FormLabel type="weekly" />
    <FormLabel type="quarterly" />
    <FormLabel type="monthly" />
    <WeeklyCtaButton type="submit">Subscribe now</WeeklyCtaButton>
  </form>
);

export default WeeklyForm;
