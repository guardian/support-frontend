// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Component ----- //

function withError(message: ?string) {
  return function HOC<Props: { id: string }>(Component: React$ComponentType<Props>): React$ComponentType<Props> {
    return (props: Props) => (
      <div>
        <Component {...props} />
        {message ? <label className="component-error" htmlFor={props.id}>{message}</label> : null}
      </div>
    );
  };
}


// ----- Exports ----- //

export { withError };
