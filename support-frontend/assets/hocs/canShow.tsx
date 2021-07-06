// ----- Imports ----- //
import React from "react";
// ----- Types ----- //
type AugmentedProps<Props> = Props & {
  isShown: boolean;
};
type In<Props> = React.ComponentType<Props>;
type Out<Props> = React.ComponentType<AugmentedProps<Props>>;

// ----- Component ----- //
function canShow<Props>(Component: In<Props>): Out<Props> {
  return ({
    isShown,
    ...props
  }: AugmentedProps<Props>) => isShown ? <Component {...props} /> : null;
}

// ----- Exports ----- //
export { canShow };