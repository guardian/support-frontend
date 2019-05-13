// @flow

// ----- Imports ----- //

import { headOption, type Option } from 'helpers/types/option';


// ----- Types ----- //

type Rule<Err> = { rule: boolean, error: Err };

export type FormError<FormField> = {
  field: FormField,
  message: string,
};


// ----- Rules ----- //

const nonEmptyString: ?string => boolean = s => (s || '').trim() !== '';

function notNull<A>(value: A): boolean {
  return value !== null;
}


// ----- Functions ----- //

function firstError<FormField>(field: FormField, errors: FormError<FormField>[]): Option<string> {

  const msgs = errors.filter(err => err.field === field).map(err => err.message);
  return headOption(msgs);

}

function removeError<FormField>(field: FormField, formErrors: FormError<FormField>[]): FormError<FormField>[] {
  return formErrors.filter(error => error.field !== field);
}

function formError<Field>(field: Field, message: string): FormError<Field> {
  return { field, message };
}

function validate<Err>(rules: Rule<Err>[]): Err[] {
  return rules.reduce((errors, { rule, error }) => (rule ? errors : [...errors, error]), []);
}


// ----- Exports ----- //

export {
  nonEmptyString,
  notNull,
  firstError,
  formError,
  removeError,
  validate,
};
