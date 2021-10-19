// ----- Imports ----- //
import type { Node } from "react";
import React from "react";
import type { Option } from "helpers/types/option";
import "helpers/types/option";
import SvgClose from "components/svgs/close";
import VeggieBurgerButton from "../veggieBurgerButton/veggieBurgerButton";
import "./mobileMenu.scss";
export type Position = Option<{
  x: number;
  y: number;
}>;
export type PropTypes = {
  onClose: () => void;
  utility: Node;
  links: Node;
  closeButtonAt?: Position;
};

// ----- Component ----- //
const MobileMenu = ({
  onClose,
  closeButtonAt,
  utility,
  links
}: PropTypes) => <div className="component-header-mobile-menu" style={closeButtonAt && {
  width: closeButtonAt.x
}}>
      <div className="component-header-mobile-menu__scroll">
        {links}
        {utility && <div className="component-header-mobile-menu__utility">
            {utility}
          </div>}
      </div>
      <VeggieBurgerButton style={closeButtonAt && {
    top: closeButtonAt.y
  }} label="close" onClick={onClose}>
        <SvgClose />
      </VeggieBurgerButton>
    </div>;

MobileMenu.defaultProps = {
  closeButtonAt: null,
  utility: null
};
export default MobileMenu;