// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import { classNameWithModifiers } from "helpers/utilities/utilities";
import "./leftMarginSection.scss";
// ----- Props ----- //
type PropTypes = {
  modifierClasses: Array<string | null | undefined>;
  className: string | null | undefined;
  children: Node;
}; // ----- Component ----- //

export default function LeftMarginSection(props: PropTypes) {
  return <section className={[props.className, classNameWithModifiers('component-left-margin-section', props.modifierClasses)].join(' ')}>
      <div className="component-left-margin-section__content">
        {props.children}
      </div>
    </section>;
} // ----- Default Props ----- //

LeftMarginSection.defaultProps = {
  modifierClasses: [],
  className: null
};