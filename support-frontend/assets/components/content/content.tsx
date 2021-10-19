import { $Keys } from "utility-types";
// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import LeftMarginSection from "components/leftMarginSection/leftMarginSection";
import { classNameWithModifiers } from "helpers/utilities/utilities";
import type { Option } from "helpers/types/option";
import "helpers/types/option";
import "./content.scss";
// ---- Types ----- //
export const Appearances = {
  white: 'white',
  grey: 'grey',
  highlight: 'highlight',
  feature: 'feature',
  dark: 'dark'
};
export const Sides = {
  right: 'right',
  left: 'left'
};
export type Appearance = $Keys<typeof Appearances>;
type PropTypes = {
  appearance: Appearance;
  id?: Option<string>;
  children: Node;
  image: Option<Node>;
  modifierClasses: Array<string>;
  innerBackground?: Option<string>;
  needsHigherZindex: boolean;
  border: Option<boolean>;
};

// ----- Render ----- //
const Content = ({
  appearance,
  children,
  id,
  modifierClasses,
  innerBackground,
  image,
  needsHigherZindex,
  border
}: PropTypes) => <div id={id} className={classNameWithModifiers('component-content', [appearance, image ? 'overflow-hidden' : null, needsHigherZindex ? 'higher' : null, border === false ? 'no-border' : null, border === true ? 'force-border' : null, ...modifierClasses])}>
    <LeftMarginSection>
      <div className={innerBackground ? `component-content__content--${innerBackground}` : 'component-content__content'}>
        {children}
        {image && <div className="component-content__image">{image}</div>}
      </div>
    </LeftMarginSection>
  </div>;

Content.defaultProps = {
  appearance: 'white',
  id: null,
  image: null,
  modifierClasses: [],
  innerBackground: null,
  needsHigherZindex: false,
  border: null
};
// ---- Children ----- //

/*
Adds a multiline divider between block children.
*/
export const Divider = ({
  small
}: {
  small: boolean;
}) => <div className={classNameWithModifiers('component-content__divider', [small ? 'small' : null])}>
    <hr className="component-content__divider__line" />
  </div>;
Divider.defaultProps = {
  small: false
};

/*
Cancels out the horizontal padding
Wrap full bleed children in this.
*/
export const Outset = ({
  children
}: {
  children: Node;
}) => <div className="component-content__outset">
    {children}
  </div>;

/*
A vertical block with max width
*/
export const NarrowContent = ({
  children
}: {
  children: Node;
}) => <div className="component-content__narrowContent">
    {children}
  </div>;

/*
A css class that sets the background colour to match the block.
Use on children that need to match the background of the parent
*/
export const bgClassName = 'component-content-bg'; // ---- Exports ----- //

export default Content;