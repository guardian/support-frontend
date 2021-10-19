// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import type { Option } from "helpers/types/option";
import "helpers/types/option";
import "./error.scss";
import { InlineError } from "@guardian/src-user-feedback";
import type { ErrorMessage } from "helpers/subscriptionsForms/validation";
// ----- Types ----- //
export type PropsForHoc = {
  error: Option<ErrorMessage>;
};
type Props = PropsForHoc & {
  children?: Option<Node>;
};

// ----- Component ----- //
function Error({
  error,
  children
}: Props) {
  return <div className={error ? 'component-form-error' : null}>
      {error && <InlineError>{error}</InlineError>}
      {children}
    </div>;
}

// ----- Exports ----- //
export { Error };