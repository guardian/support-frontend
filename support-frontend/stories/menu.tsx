import React from "react";
import { storiesOf } from "@storybook/react";
import Menu, { LinkItem, ButtonItem } from "components/menu/menu";
import { withCenterAlignment } from "../.storybook/decorators/withCenterAlignment";
const stories = storiesOf('Menu', module).addDecorator(withCenterAlignment);
stories.add('Menu', () => <Menu>
    <ButtonItem>This is a menu</ButtonItem>
    <ButtonItem>Feed it with items</ButtonItem>
    <ButtonItem>To make the menu beasts happy</ButtonItem>
    <ButtonItem isSelected>You can make an item look selected</ButtonItem>
    <LinkItem href="#">Use LinkItem for links</LinkItem>
  </Menu>);