// @flow

// ----- Imports ----- //

import React from 'react';

import uuidv4 from 'uuid';

import WeeklyCta from './weeklyCta';

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
    <WeeklyCta type="submit">Subscribe now</WeeklyCta>
  </form>
);

export default WeeklyForm;
