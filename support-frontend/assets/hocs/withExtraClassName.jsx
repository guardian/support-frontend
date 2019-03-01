// @flow

/*
This HOC adds an extra class name to an element, on top of the original one it may have.

that way, rather than doing this:
  export ({className, props}) => {
    return <div className={'original-classname ${classname}'} {...props} />
  }

you can do this:
  const Element = ({className, props}) => {
    return <div className={className} {...props} />
  }
export withExtraClassName('original-classname')(Element)

*/

// ----- Imports ----- //

import React, { type ComponentType } from 'react';

type InitialProps = {
  className?: ?string,
};

// ----- Component ----- //

function withExtraClassName(originalClassName: string) {
  return function withOriginalClassname<Props: InitialProps>(Component: ComponentType<Props>): ComponentType<Props> {
    return ({ className, ...props }) =>
      <Component {...props} className={[originalClassName, className].join(' ')} />;
  };
}

// ----- Exports ----- //

export { withExtraClassName };
