// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type Option<A> = A | null;

export type FormError<FormField> = {
  field: FormField,
  message: string,
};

type AugmentedProps<Props, FormField> = Props & {
  errors: FormError<FormField>[],
  fieldName: FormField,
};

type In<Props> = React$ComponentType<Props>;
type Out<Props, A> = React$ComponentType<AugmentedProps<Props, A>>;


// ----- Functions ----- //

function headOption<A>(arr: Array<A>): Option<A> {
  return arr[0] || null;
}

function firstError<FormField>(field: FormField): FormError<FormField>[] => Option<string> {

  return (errors) => {
    const msgs = errors.filter(err => err.field === field).map(err => err.message);
    return headOption(msgs);
  };

}


// ----- Component ----- //

function withError<Props: { id: string }>(Component: In<Props>): Out<Props, *> {

  function WrapperComponent<FormField>({ errors, fieldName, ...props }: AugmentedProps<Props, FormField>) {

    const error = firstError(fieldName)(errors);

    return (
      <div>
        <Component {...props} />
        {error ? <label className="component-error" htmlFor={props.id}>{error}</label> : null}
      </div>
    );

  }

  return WrapperComponent;
}


// ----- Exports ----- //

export { withError };
