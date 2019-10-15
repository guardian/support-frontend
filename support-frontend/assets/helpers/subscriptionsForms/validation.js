// @flow

// ----- Imports ----- //

import { headOption, type Option } from 'helpers/types/option';


// ----- Types ----- //

type Rule<Err> = { rule: boolean, error: Err };

export type FormError<FieldType> = {
  field: FieldType,
  message: string,
};


// ----- Rules ----- //

const nonEmptyString: ?string => boolean = s => (s || '').trim() !== '';

function notNull<A>(value: A): boolean {
  return value !== null;
}

// ----- Functions ----- //

function firstError<FieldType>(field: FieldType, errors: FormError<FieldType>[]): Option<string> {
  const msgs = errors.filter(err => err.field === field).map(err => err.message);
  return headOption(msgs);
}

function removeError<FieldType>(field: FieldType, formErrors: FormError<FieldType>[]): FormError<FieldType>[] {
  return formErrors.filter(error => error.field !== field);
}

function formError<FieldType>(field: FieldType, message: string): FormError<FieldType> {
  return { field, message };
}

function validate<Err>(rules: Rule<Err>[]): Err[] {
  return rules.reduce((errors, { rule, error }) => (rule ? errors : [...errors, error]), []);
}

// -------- Forms------------ //


// ----- Exports ----- //

export {
  nonEmptyString,
  notNull,
  firstError,
  formError,
  removeError,
  validate,
};
