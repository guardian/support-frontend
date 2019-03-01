// @flow

// ----- Imports ----- //

import React, { type ComponentType } from 'react';

type InitialProps = {
  className?: ?string,
};

type Out<Props> = ComponentType<Props>

// ----- Component ----- //

const withExtraClassName = (og: string) =>
  function withOriginalClassname<Props: InitialProps>(Original: ComponentType<Props>): Out<Props> {
    return ({ className, ...props }) =>
      <Original {...props} className={[og, className].join(' ')} />;
  };

// ----- Exports ----- //

export { withExtraClassName };
